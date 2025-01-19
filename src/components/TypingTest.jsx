import { useEffect, useReducer, useRef, useState } from 'react';
import '../index.css';

const paragraph = `Life is a journey defined by the choices we make, the paths we tread, and the goals we set for ourselves. Every morning brings with it a new beginning, a fresh opportunity to rewrite the story of who we are and who we aspire to become. In the face of challenges, resilience becomes our greatest ally, teaching us that setbacks are not failures but stepping stones toward success. The world around us is a mosaic of diverse cultures, ideas, and experiences, reminding us that growth often comes from stepping outside our comfort zones. As we navigate the complexities of life, it is essential to cultivate habits that fuel both the mind and the spirit—reading, reflecting, and engaging in meaningful conversations. Time is a precious resource, and how we choose to spend it determines the legacy we leave behind. Whether it's pursuing a passion, nurturing relationships, or making a difference in the lives of others, each action contributes to the rich tapestry of our existence. Remember, the journey is just as important as the destination, and the moments we cherish today will become the memories we hold dear tomorrow. So, as you type each word, let it serve as a reminder of the limitless potential within you and the incredible story you are building with every step forward. Moreover, the importance of self-awareness cannot be overstated. Understanding who we are, what motivates us, and how we react to various situations plays a crucial role in decision-making and goal setting. Self-awareness allows us to identify our strengths and weaknesses, enabling us to focus on areas that require improvement while leveraging our strengths to achieve greater outcomes. It is also the foundation of emotional regulation and empathy, qualities that are indispensable in forming meaningful relationships and fostering effective communication with others.`;

const TypingTest = () => {
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [mistakes, setMistakes] = useState(0);
  const [charIndex, setCharIndex ] = useState(0);
  const [isTyping,setIsTyping ]= useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);
  const inputRef = useRef(null)
  const charRefs = useRef([])
  const [correctWrong, setCorrectWrong] = useState([]);

  useEffect(()=>{
    inputRef.current.focus();
    setCorrectWrong(Array(charRefs.current.length).fill(''))
  },[])

  useEffect(()=> {
      let interval;
      if(isTyping && timeLeft>0){

          interval = setInterval(() => {
              setTimeLeft(timeLeft -1 );
              let correctChars = charIndex - mistakes;
              let totalTime = maxTime - timeLeft;

              let cpm = correctChars * (60/totalTime);
              cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
              setCPM(parseInt(cpm,10));
              
              
              let wpm = Math.round((correctChars /5/totalTime)*60);
              wpm = wpm < 0 || !wpm || wpm === Infinity ? 0:wpm;
              setWPM(wpm);
            
          }, 1000);
        } else if(timeLeft === 0){
          clearInterval(interval);
          setIsTyping(false);
        }
        return()=>{
          clearInterval(interval);
        };
      },[isTyping,timeLeft]);

        const resetGame =()=>{
            setIsTyping(false);
            setTimeLeft(maxTime);
            setCharIndex(0);
            setMistakes(0);
            setCPM(0);
            setWPM(0);
            setCorrectWrong(Array(charRefs.current.length).fill(''))
            inputRef.current.focus();


        }
  const handleChange = (e)=>{
        const characters = charRefs.current;
        let currentChar=charRefs.current[charIndex];
        let typedChar = e.target.value.slice(-1);
        if(charIndex < characters.length && timeLeft > 0){
            if(!isTyping){
                setIsTyping(true)
            }
            if(typedChar === currentChar.textContent ){
                setCharIndex(charIndex + 1);
                correctWrong[charIndex]= "correct"
            }
            else{
                setCharIndex(charIndex + 1 );
                setMistakes(mistakes + 1 );
                correctWrong[charIndex]= "wrong"


            }
            if(charIndex === characters.length - 1 ) setIsTyping(false)
        }
        else{
            setIsTyping(false);
            
        }

  }

  return (
    <div className="max-w-[1500px] h-[550px] m-[5px] w-[calc(100%-10px)] p-[30px] box-border bg-black/70 backdrop-blur-sm backdrop-blur-10 bg-[rgba(0,0,0,0.7)]  shadow-[0_0_6px_rgba(0,0,0,0.25)] rounded-md text-white ">
      <div className="select-none">

           <input type="text" className='input-field' ref={inputRef} onChange={handleChange}/>   {/*INPUT FIELD*/}


         {paragraph.split('').map((char, index) => (
        <span
        key={index}
        className={`char ${index === charIndex ? "active" : ""} ${correctWrong[index]} text-[20px] select-none cursor-text`}
        ref={(e) => (charRefs.current[index] = e)}
      >
        {char}
      </span>
      
        ))}
      </div>
      <div className="flex justify-between items-center mt-[15px] pt-[10px]">
        <p>
          <i className="bx bxs-time text-gray-400 hover:text-gray-600 text-2xl"></i> Time Remaining: <strong>{timeLeft}</strong>
        </p>
        <p>
          <i className="bx bxs-error text-yellow-500 hover:text-yellow-600 text-2xl"></i> Errors: <strong>{mistakes}</strong>
        </p>
        <p>
          <i className="bx bxs-keyboard text-teal-500 hover:text-teal-700 text-2xl"></i> WPM: <strong>{WPM}</strong>
        </p>
        <p>
          <i className="bx bx-dialpad text-green-500 hover:text-green-700 text-2xl"></i> CPM: <strong>{CPM}</strong>
        </p>
        <button className="p-[5px] outline-none border border-purple-500 rounded-[4px] cursor-pointer bg-[#049c13] text-white text-[15px] transition duration-400 hover:bg-[#02500b]" onClick={resetGame} >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default TypingTest;
