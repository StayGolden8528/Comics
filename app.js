const app = {};

app.apiKey = '10156415089932675'; // add api key here

app.searchQuery =  ''; //empty string to hold user input

app.handleSubmit = function(e) {
    $('form').on('submit', function (e) {
        e.preventDefault();

    app.searchQuery = $('input[name=q]').val(); //takes the value entered by the user search
    app.getComic(app.searchQuery);   //includes value above as an argument to the get comic function
    });
}

app.getCharacterBySearchUrl = `https://superheroapi.com/api/${app.apiKey}/search/${app.searchQuery}`;

// Everything we want to do on page load
app.getComic = function (userInput) {  //app.searchQuery is the userInput argument in this function to change the endpoint on the url
    let url;
        url = `https://superheroapi.com/api/${app.apiKey}/search/${userInput}`;

        
    $.ajax({
        url: 'https://proxy.hackeryou.com',
        method: 'GET',
        dataType: 'json',
        data: {
            reqUrl: `${url}`,
            xmlToJSON: false,
            useCache: false
        },
    })
    .then(function (result) {
        const {
            results
        } = result;
        app.buildComic(results); //ajax request is successful - execute the buildComic function
        
    })
    .fail(function (err) {
        $('#modal-insert').append("....Sorry - Character Not Found!",'<img src="assets/errors.png">');
        $('#spinner').removeClass('spinner');
        console.error("Result Not Found");
        });
};

app.buildComic = function (results) {

    //builds the html based upon the results
    const htmlComic = results.map(function(item) {

        console.log(item);

        const {
            name,
            image,
            powerstats
        } = item;


        const htmlString = `
		<div class="modal-header">
            <h2>${ name }</h2>
            <img src = "${ image.url }"alt = "" >
        </div>
        <div class= "modal-body">    
            <p>Combat: ${ powerstats.combat }</p>
            <p>Durability: ${ powerstats.durability }</p>
            <p>Intelligence: ${ powerstats.intelligence }</p>
            <p>Power: ${ powerstats.power }</p>
            <p>Speed: ${ powerstats.speed }</p>
            <p>Strength: ${ powerstats.strength }</p>
		</div>
		`;

        return htmlString;
    }).join('');

    $('#modal-insert').append(htmlComic);
    $('#spinner').removeClass('spinner'); //removes the spinner after the htmlComic results are populated
}

app.init = function () {
    app.handleSubmit();
};   


$(function () { //document ready begin
    app.init();


    $('#nav-icon1').click(function () {
        $(this).toggleClass('open');
    });
    
    // Get the modal
    let modal = document.getElementById('myModal');

    let btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal

    btn.onclick = function (e) {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
         $('#modal-insert').empty();
         $('#search').val("");
         $('#spinner').addClass('spinner');
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            $('#modal-insert').empty();
            $('#search').val("");
            $('#spinner').addClass('spinner');
        }
    }
    
}); //document ready end