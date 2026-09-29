document.addEventListener("DOMContentLoaded",()=>{
  const btn=document.getElementById("menuBtn"), links=document.getElementById("navLinks"), backdrop=document.getElementById("menuBackdrop");
  const close=()=>{links.classList.remove("active");backdrop.classList.remove("active");btn.setAttribute("aria-expanded","false")};
  btn?.addEventListener("click",()=>{const open=links.classList.toggle("active");backdrop.classList.toggle("active",open);btn.setAttribute("aria-expanded",open)});
  backdrop?.addEventListener("click",close);
  links?.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
});
if(typeof particlesJS!=="undefined"){
  particlesJS("particles-js",{particles:{number:{value:45,density:{enable:true,value_area:900}},color:{value:"#1477ff"},shape:{type:"circle"},opacity:{value:.35},size:{value:2.5},line_linked:{enable:true,distance:155,color:"#1477ff",opacity:.22,width:1},move:{enable:true,speed:.7}},interactivity:{events:{onhover:{enable:true,mode:"grab"}}}});
}


/* ================= HEETDEVLAB 3D HERO ================= */
(() => {
  const scene = document.getElementById("hero3d");
  const core = scene?.querySelector(".core-3d");
  if (!scene || !core) return;

  let raf = 0;
  const reset = () => {
    core.style.transform = "rotateX(12deg) rotateY(18deg) rotateZ(-2deg)";
  };

  scene.addEventListener("pointermove", (e) => {
    if (window.innerWidth <= 820 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      core.style.transform =
        `rotateX(${12 - y * 22}deg) rotateY(${18 + x * 34}deg) rotateZ(${x * 4}deg)`;
      scene.style.setProperty("--mx", `${x * 8}deg`);
      scene.style.setProperty("--my", `${y * 8}deg`);
    });
  });

  scene.addEventListener("pointerleave", reset);
})();
