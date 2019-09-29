function calculate(){

    if (!navigator.onLine){
        document.getElementById("wynik").innerText = "Nie można połączyć się z serwerem NBP";   
    }

    var request = new XMLHttpRequest();
    request.open('GET', "https://www.nbp.pl/xml/stopy_procentowe.xml", true);

    request.onload = function(){

        if (this.status != 200){
            document.getElementById("wynik").innerText = "Nie można połączyć się z serwerem NBP";   
        }

        try {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(this.responseText,"text/xml");

            var oprocentowanie = xmlDoc.getElementsByTagName("stopy_procentowe")[0].childNodes[1].childNodes[1].getAttribute('oprocentowanie');
            var opr = escape(parseFloat(oprocentowanie.replace(',', '.').replace(' ', '')));
            console.log(opr);
            var kzp = escape(parseFloat(document.getElementById("kzp").value.replace(',', '.').replace(' ', '')));
            console.log(kzp);
            var dni = escape(parseInt(document.getElementById("liczbaDni").value));
            console.log(dni);

            var wynik = kzp * opr * (dni/365)
            if (!isNaN(wynik)){
                document.getElementById("wynik").innerText = wynik.toFixed(2);   
            }
            else
            {
                document.getElementById("wynik").innerText = "Coś poszło nie tak, sprawdź wpisane dane i spróbuj ponownie";
            }
            
        } catch (error) {
            document.getElementById("wynik").innerText = "Coś poszło nie tak, spróbuj ponownie";
        }
        
    }
    try {
    request.send();
    }
    catch (error) {
        document.getElementById("wynik").innerText = "Coś poszło nie tak, spróbuj ponownie";
    }
}