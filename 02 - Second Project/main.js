/// <reference path="jquery-3.6.1.js" /> 

"use strict";

$(() => {

    // Hide h3 and search when opening the page / entering "About page"   
    hideFunc();

    // Welcome Text
    $("#contentDiv").html(`
    <div id="welcomeText">
        <link href="https://fonts.googleapis.com/css?family=Roboto:100" rel="stylesheet">
        <p id='head1' class='header'>Welcome To Crypto Hype
        </p>
        <p id='head2' class='header'>simple & accurate <br>crypto currencies </p>
        <p id='head3' class='header'><i class="fa-regular fa-circle-up"></i> To continue to Crypto Coins <br> press "Currencies"</p>
    </div>
    `);

    // Hide search option and h3
    function hideFunc() {
        $(".loader").hide();
        $("h3").css("display", "none");
        $("#searchOption").css("display", "none");
        $("#searchButton").css("display", "none");
        $("#welcomeText").fadeOut(1000);
    }

    // Show search option and h3 header 
    function showFunc() {
        $("#searchOption").css("display", "block");
        $("#searchButton").css("display", "block");
        $("#welcomeText").fadeOut(1000);
    }

    let coins;

    // Currencies Page entry
    $("#currenciesLink").on("click", async () => {
        coins = await getJson("https://api.coingecko.com/api/v3/coins");
        loadFromLocalStorage();
        showFunc();
        $(".loader").show();
        setTimeout(() => {
            $("h3").css("display", "block");
            displayCoins(coins);
            $(".loader").remove();
        }, 500);
    });

    // Reports Page Entry 
    $("#reportsLink").on("click", () => {
        hideFunc();
        displayReports();
    });

    // About Page entry
    $("#aboutLink").on("click", () => {
        hideFunc();
        displayAbout();
    });

    // All the symbols in one array, for search option
    const symbolArray = [];

    // Get Currencies cards information/data of crypto coins
    function displayCoins(coins) {
        let html = "";
        for (const coin of coins) {
            symbolArray.push(coin.symbol);
            let checked = "unchecked";
            if (selectedCoins.indexOf(coin.symbol.toUpperCase()) !== -1) {
                checked = "checked";
            }
            html += `
            <div class="card"  id="${coin.symbol}">
                <label class="toggle">
                    <input type="checkbox" ${checked} id="input_check${coin.symbol.toUpperCase()}">
                    <span class="slider" id="check${coin.symbol.toUpperCase()}"><i class="fa-solid fa-circle-check"></i></span>
                </label>
                ${coin.symbol}
                <br>
                ${coin.name}
                <br>
                <button id="moreInfoBtn" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#${coin.id}">
                More Info
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                </button>
                <div class="collapse" id="${coin.id}">
                    <div class="card-body">
                <img src="${coin.image.small} ">
                ${coin.market_data.current_price.usd}$
                <span> | </span>
                ${coin.market_data.current_price.eur}€
                <span> | </span>
                ${coin.market_data.current_price.ils}₪   
                    </div>
                </div>
            </div>
                `;
            console.log(checked);
        }
        $("#contentDiv").html(html);

        // Activate Toggle Function and get data
        for (let coin of coins) {
            $(`#check${coin.symbol.toUpperCase()}`).on('click', (e) => toggleFunc(e.target, coin.symbol.toUpperCase()));
        }

        // Search Option
        $("#searchButton").on("click", (e) => {
            e.preventDefault();
            $("h3").hide();
            $(".card").hide();
            const searchCoin = $("#searchOption").val();
            if (searchCoin.length === 0) {
                $("#contentDiv").html(`
                <div>
                <img id="errorMsg"src="assets/images/error.gif">
                </div>`
                );
                $("#searchOption").css("display", "none");
                $("#searchButton").css("display", "none");
            }
            symbolArray.filter(symbolArray => symbolArray.toLowerCase().startsWith(searchCoin) === searchCoin.toLowerCase().startsWith(searchCoin))
                .forEach(name => {
                    $(`#${name}`).slideDown(400);
                });
        });
    }

    // Reports Page
    function displayReports() {
        $("#contentDiv").html(`<img id="comingSoonMsg" src="assets/images/coming-soon.gif">`);
    }

    // About Page
    function displayAbout() {
        let html = "";
        html += `
        <div id="aboutCard">
            <div class="imgBox">
                <img src="assets/images/student-identity.jpg">
                <img src="assets/images/MichaelSaravaisky2.jpg">
            </div>
            <div class="details">
                <div class="content">
                    <h2>Michael Saravaisky</h2>
                    <span>
                        age: 22 <br><br>
                        gender: male <br><br>
                        education: Fullstack Developer Student in John Bryce College.<br><br>
                    </span>
                    <div class="social-icons">
                        <a href="https://www.instagram.com/accounts/login/?next=%2Fmiha_sar%2F&source=omni_redirect">
                            <div class="tooltip">Instagram</div>
                            <i class="fa-brands fa-instagram"></i></a>
                        <a href="https://www.linkedin.com/in/michael-saravisky-7a7518235?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BCyJ22GjNSxmJbj0kmFS5wA%3D%3D">
                            <div class="tooltip">Linkedin</div>
                            <i class="fa-brands fa-linkedin"></i></a>
                        <a href="mailto:misar2000@gmail.com">
                            <div class="tooltip">Mail</div>
                            <i class="fa-solid fa-envelope"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <div id="projectDescription">
            <div class="imgBox">
                <img src="assets/images/project-description.jpg">
                <img src="assets/images/project-description-image.png">
            </div>
            <div class="details">
                <div class="content">
                    <h2>Crypto Currencies</h2>
                    <span>
                    Crypto currencies web-site that includes live crypto coins values in USD, EURO and ILS.
                    You can choose up to 5 favorite coins that will be saved until you will to change them.<br><br>
                    When you choose more than 5 coins, you get a pop-up message that asking you to remove one the coins you choose to continue.<br><br>
                        Programing Languages used in this project: html,css,JavaScript and jQuery library.
                    </span>
                </div>
            </div>
        </div>
                    `;
        $("#contentDiv").html(html);
    }

    // Get AJAX function
    async function getJson(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    // Load from local storage
    function loadFromLocalStorage() {

        const jsonString = localStorage.getItem("selectedCoins");
        const selectedCoins = JSON.parse(jsonString);

        if (selectedCoins === null) {
            return [];
        }
        return selectedCoins;
    }

    // Save to Local Storage
    function saveToLocalStorage(selectedCoins) {
        const jsonString = JSON.stringify(selectedCoins);
        localStorage.setItem("selectedCoins", jsonString);
    }

    // Toggle Function
    let selectedCoins = loadFromLocalStorage();
    let selectedToggleIds = [];

    function toggleFunc(currentToggle, coinName) {

        const toggleId = currentToggle.id;
        let indexSymbolCoin = selectedCoins.indexOf(coinName);
        let indexIdToggleLive = selectedToggleIds.indexOf(toggleId);

        if (indexSymbolCoin !== -1) {
            selectedCoins.splice(indexSymbolCoin, 1);
            selectedToggleIds.splice(indexIdToggleLive, 1);
            saveToLocalStorage(selectedCoins, selectedToggleIds);
        } else {
            if (selectedCoins.length < 5) {
                selectedCoins.push(coinName);
                selectedToggleIds.push(toggleId);
                saveToLocalStorage(selectedCoins, selectedToggleIds);
            }
            else {
                $(`${toggleId}`).prop('checked', false);
                selectedCoins.push(coinName);
                selectedToggleIds.push(toggleId);
                $("#modalBody").html('To add the "<b>' + coinName + '</b>" coin, you must remove one of the following coins or remove "<b>' + coinName + '</b>" itself to continue: <br>');
                $("#myModal").css("display", "block");
                $("#keepCurrent").on("click", () => {
                    $("#keepCurrent").html("You can't close❌ unless you remove one !");
                    $("#myModal").css("display", "block");
                });
                createModalContent();
                saveToLocalStorage(selectedCoins, selectedToggleIds);
            }
        }
    }

    // Clear Modal Content from the Screen
    function clearModalContent() {
        $("#modalBody").html('')
    }

    // Create Modal Content in the Screen and choose coins to unToggle
    function createModalContent() {
        for (let i = 0; i < selectedCoins.length; i++) {
            $("#modalBody").append(
                `<div id="modalDiv">
                    <div class="card" id="modalCard">
                    <label class="switch" id="modalSwitch">
                        <input type="checkbox" id="modal_checkbox${i}" checked="true" class="modalDiv_${selectedCoins[i]}">
                        <span class="modalSlider" id="chosenToggle">
                        <h6 class="card-title" id="modalCard"><i class="fa-solid fa-circle-check"></i> &nbsp;${selectedCoins[i]}</h6>
                        </span>
                    </label>
                            
                    </div>
                </div>   `
            );

            $(`#modal_checkbox${i}`).on('change', (e) => {
                $("#keepCurrent").html("Excellent👍 <br> now you can close✅");
                $("#keepCurrent").on("click", () => {
                    $("#myModal").css("display", "none");
                });
                const idx = selectedCoins.findIndex(c => c === e.target.className.split('_')[1])
                const coin = selectedCoins[idx]
                $(`#input_check${coin.toUpperCase()}`).prop('checked', false)
                $(`#check${coin.toUpperCase()}`).prop('checked', false)
                selectedCoins.splice(idx, 1)
                selectedToggleIds.splice(idx, 1);
                clearModalContent()
                createModalContent();
                saveToLocalStorage(selectedCoins);
            })
        }
    }
});