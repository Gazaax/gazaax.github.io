const container = document.getElementById('particles');

for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 3  + 1;

    p.style.cssText = `
    width:${size}px;
    height:${size}px;
    left:${Math.random() * 100}%;     
    bottom:${Math.random() * 20}%;       
    animation-duration:${8 + Math.random() * 14}s;  
    animation-delay:${-Math.random() * 10}s;         
  `;

    container.appendChild(p);
}