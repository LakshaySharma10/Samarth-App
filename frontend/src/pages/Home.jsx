import React from 'react';
import { useSpring, animated } from 'react-spring';

const smoothScroll = (target, duration) => {
  const start = window.scrollY;
  const end = target.offsetTop;
  const distance = end - start;
  const startTime = performance.now();

  const scroll = (currentTime) => {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    window.scrollTo(0, start + distance * easeInOutQuad(progress));

    if (timeElapsed < duration) {
      requestAnimationFrame(scroll);
    }
  };

  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  requestAnimationFrame(scroll);
};

const Home = () => {
  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 1000 } });

  const handleScroll = (event) => {
    event.preventDefault();
    const target = document.getElementById('solution');
    if (target) {
      smoothScroll(target, 100); 
    }
  };

  return (
    <main className="w-full bg-black">
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-75 bg-animation"></div>
        </div>
        <div className="relative z-10 text-center p-8">
          <animated.div style={fadeInProps}>
            <h1 className="text-5xl font-bold mb-14">Our Approach to Transforming Talent Acquisition</h1>
            <p className="text-lg  mb-8">At Samarth, we revolutionize the recruitment process with our 
              AI-Enhanced Job Application and Interview System. By integrating cutting-edge technologies
               like LLaMA 3.1 and Whisper with a robust MERN stack architecture, we automate candidate 
               evaluation and provide real-time feedback. Our platform offers a seamless user experience, 
               allowing job seekers to apply, schedule interviews, and receive actionable insights instantly.
                For recruiters, we deliver detailed AI-driven assessments, enhancing the decision-making process.
                 Samarth is dedicated to streamlining recruitment, making it more efficient, accurate, and 
                 user-friendly for both candidates and employers.</p>
            <button onClick={handleScroll} className="btn  text-black px-6 py-3 rounded-full text-lg transition duration-300 ">
              Learn More
            </button>
          </animated.div>
        </div>
      </section>

      <section id="problem" className="py-20 bg-black text-white relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl mt-11 font-bold mb-8">Understanding the Challenge</h2>
          <p className="text-lg max-w-6xl mx-auto mb-12">
          Traditional interview methods are often plagued by subjectivity, bias, and inconsistent engagement. Finding the right talent demands a solution that promotes fairness, relevance, and a more authentic experience. At Samarth, we redefine the interview process to ensure objectivity and deeper candidate insights, enhancing both fairness and accuracy.
          </p>
        </div>
      </section>

      <section id="solution" className="py-20 bg-black text-white relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-12">Our Solution</h2>
          <div className="flex flex-col w-3/4 ml-44 md:flex-row justify-center gap-8">
            <div className="bg-[#020d02] border-[#0b5428] border-2 p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-white-800 mb-4">Real-life Board Room Experience</h3> 
              <p className="text-lg text-white">
                We create a realistic boardroom atmosphere, starting with initial ice-breaking questions and progressing to in-depth discussions tailored to the candidate's level of expertise.
              </p>
            </div>
            <div className="bg-[#020d02] border-[#0b5428] border-2 p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-white-800 mb-4">Quantifiable Scoring System</h3> 
              <p className="text-lg text-white">
                Our system provides a quantifiable score based on the relevance of questions and answers, ensuring objective and data-driven evaluations.
              </p>
            </div>
            <div className="bg-[#020d02] border-[#0b5428] border-2  p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-white-800 mb-4">Project Goals and Fairness</h3> 
              <p className="text-lg text-white">
                By removing bias and focusing on relevant, contextual questioning, we ensure that the most suitable candidates are identified for each role.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
