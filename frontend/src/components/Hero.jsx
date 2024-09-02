import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {

  useGSAP(() => {
    gsap.to('#hero', { opacity: 1, delay: 1 });
    gsap.to('#cta', { opacity: 1, y: -50, delay: 2 });
    gsap.to('#description', { opacity: 1, y: -20, delay: 1.5 });

    // Fading pulse effect with follow-up lines
    const pulses = gsap.timeline();
    pulses.fromTo('.radar-pulse', {
      scale: 0.5,
      opacity: 0.1,
    }, {
      scale: 2,
      opacity: 0,
      duration: 3,
      ease: "power1.inOut",
    })
    .fromTo('.radar-follow-up', {
      scale: 0.5,
      opacity: 0.1,
    }, {
      scale: 1.5,
      opacity: 0,
      stagger: 0.5,
      duration: 2.5,
      ease: "power1.inOut",
    }, "-=2.5");
  }, []);


  // Navigate to the interview page
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/interview');   
  };

  return (
    <section className='w-full nav-height bg-black relative overflow-hidden'>
      <div className='h-5/6 w-full flex-center flex-col relative z-10'>
        <p 
          id="hero" 
          className='hero-title text-9xl md:text-9xl font-bold w-full text-center px-4'
        >
          Samarth 
        </p>
        <p 
          id="description" 
          className='text-center mt-28 md:text-lg text-sm max-w-2xl opacity-0 translate-y-20 px-4'
        >
        Unlock your potential with Samarth, where transformative projects and pioneering advancements shape your dynamic career and lasting impact.
        </p>
      </div>
      <div 
        id='cta' 
        className='flex flex-col items-center opacity-0 translate-y-28 relative z-10'
      >
        <a href='' onClick={handleApplyClick} className='btn'>Apply Now</a>
        {/* <p className='font-normal text-xl'>Shape the Future of National Security</p> */}
      </div>

      {/* Radar Pulse Effect */}
      <div className='absolute inset-0 flex-center'>
        <div className='radar-container relative'>
          <div className='radar-pulse absolute w-full h-full rounded-full'></div>
          <div className='radar-follow-up absolute w-full h-full rounded-full'></div>
          <div className='radar-follow-up absolute w-full h-full rounded-full'></div>
        </div>
      </div>

      {/* Grid Overlay */}
      <div className='absolute inset-0 grid'></div>
    </section>
  );
};

export default Hero;
