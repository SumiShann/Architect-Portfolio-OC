function getWork(){
    fetch("http://localhost:5678/api/works")
        .then(function(res){
            if (res.ok){
                return res.json();
            }
        })
        .then(function(res){
            const works = Array.from(res);
            for (let i = 0; i < works.length; i++, value){
                let work = document.createElement("figure");
                let image = document.createElement('img');
                let caption = document.createElement('figcaption');
                document.querySelector('.gallery').appendChild(work);
                work.appendChild(image);
                work.appendChild(caption);
                caption.innerText = value.works.title;
                image.setAttribute('src', value.works.imageURL);
            }
        })
        .catch(function(err){
            console.error(err);
        });
}

getWork();

