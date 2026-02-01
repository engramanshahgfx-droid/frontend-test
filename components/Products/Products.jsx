"use client";
import { useState, useEffect, useRef } from "react";
import './product.css';

// 🌌 Particle Canvas Component
// function ParticleCanvas({ style }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");

//     let width = (canvas.width = canvas.offsetWidth);
//     let height = (canvas.height = canvas.offsetHeight);

//     const resize = () => {
//       width = canvas.width = canvas.offsetWidth;
//       height = canvas.height = canvas.offsetHeight;
//     };
//     window.addEventListener("resize", resize);

//     const particles = Array.from({ length: 200}, () => ({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       r: Math.random() * 2 + 1,
//       vx: (Math.random() - 0.5) * 0.5,
//       vy: (Math.random() - 0.5) * 0.5,
//       opacity: Math.random(),
//       fade: Math.random() * 0.02 + 0.005,
//     }));

//     function draw() {
//       // Dark blue background
//       ctx.fillStyle = "#001233";
//       ctx.fillRect(0, 0, width, height);

//       // Draw particles
//       particles.forEach(p => {
//         p.x += p.vx;
//         p.y += p.vy;

//         if (p.x < 0 || p.x > width) p.vx *= -1;
//         if (p.y < 0 || p.y > height) p.vy *= -1;

//         p.opacity += p.fade;
//         if (p.opacity > 1 || p.opacity < 0) p.fade *= -1;

//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255,255,255,${p.opacity})`; // white particles
//         ctx.fill();
//       });

//       requestAnimationFrame(draw);
//     }

//     draw();

//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         width: "100%",
//         height: "100%",
//         position: "absolute",
//         top: 0,
//         left: 0,
//         zIndex: 0,
//         ...style
//       }}
//     />
//   );
// }

// 🌟 Products Component
export default function Products({ lang = "en" }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const imgRefs = useRef([]);

  const categories = [
    { key: "All", label: lang === "ar" ? "الكل" : "All" },
    { key: "Web Development", label: lang === "ar" ? "تطوير الويب" : "Web Development" },
    { key: "App Development", label: lang === "ar" ? "تطوير التطبيقات" : "App Development" },
      { key: "Mobile App Development", label: lang === "ar" ? "تطوير التطبيقات" : "Mobile App Development" },
          { key: "Graphic Design", label: lang === "ar" ? "تطوير التطبيقات" : "Graphic Design" },
              { key: "Digital Marketing", label: lang === "ar" ? "تطوير التطبيقات" : "Digital Marketing" },
                  { key: "Video And Animation", label: lang === "ar" ? "تطوير التطبيقات" : "Video And Animation" },
  ];

  const products = [
    { name: lang === "ar" ? "مشروع 1" : "Project 1", img: "https://api-codesinc.clickbooster.io/public/uploads/projects/1747231934.png", link: "#", category: "App Development" },
    { name: lang === "ar" ? "مشروع 2" : "Project 2", img: "/graphic.png", link: "https://sites.google.com/view/brandraize/%D9%85%D9%84%D9%81", category: "Graphic Design" },

   { name: lang === "ar" ? "مشروع 3" : "Project 3", img: "/roaya.png", link: "https://roaya.com.sa/", category: "Web Development" },
    //  { name: lang === "ar" ? "مشروع 4" : "Project 4", img: "/mayasam.png", link: "https://mayasm.sa/home", category: "Digital Marketing" },
//        { name: lang === "ar" ? "مشروع 5" : "Project 5", img: "/amahar.png", link: "https://www.ammhar.com/en/contact-us", category: "Web Development" },
//          { name: lang === "ar" ? "مشروع 6" : "Project 6", img: "/bit.png", link: "https://b-it.co/en", category: "Web Development" },
//   { name: lang === "ar" ? "مشروع 7" : "Project 7", img: "/mainflo.png", link: "https://flah-r.com/", category: "Digital Marketing" },
// { name: lang === "ar" ? "مشروع 8" : "Project 8", img: "/faras.png", link: "https://dkr.sa/", category: "Web Development" },
// { name: lang === "ar" ? "مشروع 9" : "Project 9", img: "/jhitzone.png", link: "https://jhitzone.com/", category: "Video And Animation" },
// { name: lang === "ar" ? "مشروع 10" : "Project 10", img: "/imtiaz.png", link: "https://imtiyazat-al-amal.com/", category: "Mobile App Development" },
// { name: lang === "ar" ? "مشروع 11" : "Project 11", img: "/mendar.png", link: "https://mendar.sa/", category: "Web Development" },
// { name: lang === "ar" ? "مشروع 12" : "Project 12", img: "/sculpture.png", link: "https://almajalsculptur.com/  ", category: "Graphic Design" },
// { name: lang === "ar" ? "مشروع 13" : "Project 13", img: "/alkahtani.png", link: "https://salemalkahtani.com/ ", category: "Video And Animation" },
// { name: lang === "ar" ? "مشروع 14" : "Project 14", img: "/diarna.png", link: "https://diaarna.com/", category: "Digital Marketing" },
// { name: lang === "ar" ? "مشروع 15" : "Project 15", img: "/tallahgift.png", link: "https://tallahgift.com/  ", category: "App Development" },
{ name: lang === "ar" ? "مشروع 16" : "Project 16", img: "/wesha.png", link: "https://ayalsa.com/products/emb-scr/", category: "Video And Animation" },
  ];

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  useEffect(() => {
    imgRefs.current.forEach(img => {
      if (!img) return;
      const cardHeight = 280;
      const imgHeight = img.naturalHeight * (img.clientWidth / img.naturalWidth);
      const slide = imgHeight > cardHeight ? -(imgHeight - cardHeight) : 0;
      img.style.setProperty('--slide-height', `${slide}px`);
      const duration = Math.max(8, Math.abs(slide) * 0);
      img.style.setProperty('--scroll-duration', `${duration}s`);
    });
  }, [filteredProducts]);

  return (
    <section
      className="py-5 position-relative"
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{ minHeight: "100vh", background: "#" }} // dark blue
    >
      {/* Particle Canvas */}
      {/* <ParticleCanvas /> */}

      {/* Content */}
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="lg:w-7/12 w-full mb-3 lg:mb-0 text-center lg:text-left">
          <h2 className="text-5xl md:text-6xl lg:text-7xl fw-bold text-white uppercase">
            {lang === "ar" ? "مشاريع حائزة على جوائز" : "Award Winning Projects"}
          </h2>
        </div>

        {/* Categories */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`category-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="row g-3">
          {filteredProducts.map((product, idx) => (
            <div key={idx} className="col-12 col-md-4 col-lg-3">
              <div className="product-card">
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  <img src={product.img} alt={product.name} ref={el => imgRefs.current[idx] = el} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
