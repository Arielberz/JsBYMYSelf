async function fetchdata() {

    try{
        const name= document.getElementById("name").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

        if (!response.ok) {
            throw new Error("could not fetch data");
        }
        const data = await response.json();
        const img = data.sprites.front_default;
        const elment = document.getElementById("pokemon");

        elment.src = img;
        elment.style.display = "block";
    }
    catch(error){
        console.error(error);

    }
    
}
fetchdata();
