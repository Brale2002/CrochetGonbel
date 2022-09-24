const cuadro = document.querySelector(".cuadro");
const dragText = cuadro.querySelector('h2');
const button = cuadro.querySelector('button');
const input = cuadro.querySelector("#input-file");
let files;


button.addEventListener("click" , (e)=> {
   input.click();
});

input.addEventListener('change' , (e)=>{
  files= this.files;
  cuadro.classList.add("active");
  Showfiles(files);
  cuadro.classList.remove("active"); 
});

cuadro.addEventListener("dragover", (e)=>{
  e.preventDefault();
  cuadro.classList.add("active");
  dragText.textContent="Suelta para subir los archivos";

});

cuadro.addEventListener("dragleave", (e)=>{
  e.preventDefault();
  cuadro.classList.remove("active");
  dragText.textContent="Arrastra y suelta Imagenes";

});

cuadro.addEventListener("drop", (e)=>{
  e.preventDefault();
  files=e.dataTransfer.files;
  Showfiles(files);
  cuadro.classList.remove("active");
  dragText.textContent="Arrastra y suelta Imagenes";
});


function Showfiles(files) {
  if(files.length=undefined){
    processfile(files);
  }else{
    for(const file of files){
    processfile(file);
     
        }
    }
}

function processfile(file){
  const docType=file.type;
  const validExtensions=['image/jpg','image/jpg','image/png','image/gif']

  if (validExtensions.includes(docType)) {
    const fileReader = new FileReader();
    const id= `file-${math.random().tostring(32).substring(7)}`;

    fileReader.addEventListener('load', e=>{
      const fileUrl = fileReader.result;
      const image = ` 
        <div id="${id}" class="file-container">
            <img src="${fileUrl}" alt="${file.name}""width=50">
            <div class="status">
                <span>${file.name}</span>
                <span class="status-text">
                   Loading...
                </span>
            </div>   
        </div>
        `;

        document.querySelector("#preview").innerHTML = image + html;
    });

    fileReader.readAsDataURL(file);
    uploadfile(file, id);
  }else{
    alert('No es un archivo valido')
  }
} 

function uploadfile(file){

}

