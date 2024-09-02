import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DRDOPage = () => {
  useEffect(() => {
    gsap.fromTo(
      '.fade-in',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'elastic.inOut', stagger: 0.3 }
    );

    gsap.fromTo(
      '.timeline-section',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'elastic.inOut', stagger: 0.5 }
    );

    gsap.to('.parallax-background', {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax-background',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  return (
    <main className="w-full bg-black text-white overflow-hidden">     
      <section className="h-screen p-8 flex items-center justify-center bg-black text-white">
        <div className="text-center fade-in">
         <h1 className="text-5xl font-bold mb-14">Defence Research and Development Organisation</h1>
<p className="text-lg mb-8">
  DRDO is an esteemed agency of the Indian government dedicated to advancing defense technology and innovation. With a mission to enhance national security through cutting-edge research, DRDO develops a wide range of sophisticated defense systems, including missiles, electronics, and combat vehicles. Its initiatives are pivotal in strengthening the country's defense capabilities, ensuring superior military readiness, and fostering technological progress. By integrating advanced technologies, DRDO contributes significantly to national security and global defense advancements.
</p>

        </div>
      </section>

      <section className="py-16 bg-black text-white relative overflow-hidden">
        <div className="parallax-background absolute inset-0 bg-black" style={{ height: '100vh', zIndex: -1 }}></div>
        <div className="container mx-auto px-6 w-2/3">
          <h2 className="text-4xl font-bold mb-8 text-center fade-in">What DRDO Does</h2>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-l-2 border-green-700 h-full"></div>
            </div>
            <div className="flex flex-col space-y-12">
              <div className="flex flex-row justify-between space-x-8">
                <div className="flex flex-col p-12 space-y-12">
  {[
    { title: "Missile Systems", description: "Development of various missile systems, including ballistic and cruise missiles, which are essential for enhancing India’s strategic defense capabilities. These systems are crucial for maintaining national security and deterrence in modern warfare scenarios." },
    { title: "Naval Systems", description: "Cutting-edge naval technologies, including sophisticated sonar systems and advanced underwater surveillance technologies. These innovations are pivotal for enhancing maritime security and ensuring the effectiveness of naval operations and defense against underwater threats." },
    { title: "Life Sciences", description: "Extensive research aimed at ensuring the health, safety, and well-being of armed forces personnel. This includes developing medical technologies and strategies to address health challenges and improve the quality of life for soldiers in various environments." }
  ].map((item, index) => (
    <div key={index} className="timeline-section bg-green-700 p-8 rounded-lg fade-in relative w-full max-w-sm">
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-green-700 border-4 border-black"></div>
      <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
      <p>{item.description}</p>
    </div>
  ))}
</div>
<div className="flex flex-col p-12 space-y-12">
  {[
    { title: "Aeronautics", description: "Designing and developing advanced aircraft, unmanned aerial vehicles (UAVs), and other aeronautical systems. This includes innovations in aviation technology to enhance aerial capabilities, improve surveillance, and support various military and defense operations." },
    { title: "Armament Technology", description: "Development of advanced weapons systems, ammunition, and combat vehicles tailored for the Indian Army. These technologies focus on enhancing combat effectiveness and operational readiness, contributing significantly to the army’s strategic and tactical capabilities." },
    { title: "Electronics & Radar", description: "Development of cutting-edge electronic warfare systems, radar technologies, and advanced communication systems. These innovations are critical for superior surveillance, detection, and communication capabilities, enhancing overall defense effectiveness and operational superiority." }
  ].map((item, index) => (
    <div key={index} className="timeline-section bg-green-700 p-8 rounded-lg fade-in relative w-full max-w-sm">
      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-green-700 border-4 border-black"></div>
      <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
      <p>{item.description}</p>
    </div>
  ))}
</div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black text-white">
       <div className="container mx-auto px-6 text-center">
  <h2 className="text-4xl font-bold mb-8 fade-in">DRDO's Contributions</h2>
  <div className="flex justify-between gap-8">
    <ul className="text-lg px-4 flex flex-col list-disc list-inside fade-in w-1/2">
      <li className='mb-10'>Advanced Weapon Systems: DRDO develops cutting-edge missile systems like Agni and BrahMos, enhancing national defense and strategic capabilities significantly.</li>
      <li className=''>Defensive Technologies: DRDO creates advanced radar systems and electronic warfare equipment, bolstering India’s defense against aerial and missile threats.</li>
    </ul>
    <ul className="text-lg  px-4 flex flex-col list-disc list-inside fade-in w-1/2">
      <li className='mb-10'>Combat Vehicles: DRDO engineers robust combat vehicles such as the Arjun tank, improving ground mobility and firepower for armed forces.</li>
      <li className=''>Aerospace Innovations: DRDO pioneers in aerospace technology, including satellites and UAVs, supporting surveillance, reconnaissance, and communication missions effectively.</li>
    </ul>
  </div>
</div>

      </section>

      <section className="py-16 bg-black text-white text-center">
        <div className="container mx-auto fade-in">
          <h2 className="text-4xl font-bold mb-6">Explore More About DRDO</h2>
          <p className="text-lg  mx-auto mb-8">
            DRDO continues to push the boundaries of technology to secure India's future. Discover more about their ongoing projects and how they are shaping the defense landscape.
          </p>
          <a href="https://www.drdo.gov.in/" target="_blank" rel="noopener noreferrer" className="btn text-white px-6 py-3 rounded-full text-lg transition duration-300 fade-in">
            Visit Official Website
          </a>
        </div>
      </section>
    </main>
  );
};

export default DRDOPage;
