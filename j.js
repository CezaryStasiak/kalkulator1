var dueDays = null;
window.onload = function (event){
    dueDays = [25, 25, 27, 27, 25, 25, 27, 25, 26, 27, 25, 25, 26, 25, 28];
    setDueDate();
}
var m = null;

function setDueDate(){
    let date = document.getElementById("month");
    let dueDate = document.getElementById("termin");

    m = parseInt(date.value) + 1;
    
    dueDate.innerText = "Termin płatności : " + dueDays[m] + " " + document.querySelectorAll("option[value='" + m + "']")[0].innerText + " " + document.querySelectorAll("option[value='" + m + "']")[0].parentNode.label;
    document.getElementById("payDay").innerText = document.querySelectorAll("option[value='" + m + "']")[0].innerText;
}

function calculate(){
    let wynText = document.getElementById("wynik");
    if (!navigator.onLine){
        wynText.innerText = "Nie można połączyć się z serwerem NBP";   
    }

    var request = new XMLHttpRequest();
    request.open('GET', "https://www.nbp.pl/xml/stopy_procentowe.xml", true);

    request.onload = function(){

        if (this.status != 200){
            wynText.innerText = "Nie można połączyć się z serwerem NBP";   
        }

        try {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(this.responseText,"text/xml");

            var oprocentowanie = xmlDoc.getElementsByTagName("stopy_procentowe")[0].childNodes[1].childNodes[1].getAttribute('oprocentowanie');
            var opr = escape(parseFloat(oprocentowanie.replace(',', '.').replace(' ', '')));
            opr = opr / 100;
            console.log(opr);
            var kzp = escape(parseFloat(document.getElementById("kzp").value.replace(',', '.').replace(' ', '')));
            console.log(kzp);
            var dni = dueDays[m] - escape(parseInt(document.getElementById("liczbaDni").value));
            if (dni > dueDays[m] || dni < 0){
                wynText.innerText = "Dzień zapłaty jest nie poprawny";
                return;
            }
            console.log(dni);

            var wynik = kzp * opr * (dni/365);
            console.log(wynik);
            
            if (!isNaN(wynik)){
                if (wynik > 1){
                    wynText.innerText = wynik.toFixed(0);   
                }
                if (wynik < 1){
                    wynText.innerText = wynik.toFixed(1);   
                }
            }
            else
            {
                wynText.innerText = "Coś poszło nie tak, sprawdź wpisane dane i spróbuj ponownie";
            }
            
        } catch (error) {
            wynText.innerText = "Coś poszło nie tak, spróbuj ponownie";
        }
        
    }
    try {
    request.send();
    }
    catch (error) {
        wynText.innerText = "Coś poszło nie tak, spróbuj ponownie";
    }
    
}