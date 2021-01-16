let addtoCart=document.querySelectorAll('.add-bt');

addtoCart.forEach((btn)=>{
btn.addEventListener('click',(e)=>{

let product=btn.dataset.pic;
console.log (product);
})

})