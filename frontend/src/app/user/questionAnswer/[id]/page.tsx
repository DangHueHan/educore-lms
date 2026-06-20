
// "use client";

// import { use, useEffect, useState } from "react";

// const BASE_URL = "http://localhost:3001";

// function shuffleArray(arr: any[]) {
//   const newArr = [...arr];

//   for (let i = newArr.length - 1; i > 0; i--) {
//     const j = Math.floor(
//       Math.random() * (i + 1)
//     );

//     [newArr[i], newArr[j]] = [
//       newArr[j],
//       newArr[i],
//     ];
//   }

//   return newArr;
// }

// type AnswerState = "" | "answered" | "correct" | "wrong";

// export default function QuestionAnswerPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id: courseId } = use(params);

//   const [questions, setQuestions] = useState<any[]>([]);
//   const [index, setIndex] = useState(0);

//   const [selectedAnswer, setSelectedAnswer] = useState<string>("");
//   const [answerState, setAnswerState] =
//     useState<AnswerState>("");

//   const [remainingTime, setRemainingTime] =
//     useState(10000);

//   const question = questions[index];

//   // =========================
//   // FETCH QUIZ
//   // =========================
//   // useEffect(() => {
//   //   fetch(`${BASE_URL}/courses/${courseId}/quiz`)
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       setQuestions(data);
//   //     });
//   // }, [courseId]);
//   useEffect(() => {
//   fetch(`${BASE_URL}/courses/${courseId}/quiz`)
//     .then((res) => res.json())
//     .then((data) => {
//       const shuffledQuestions = data.map((q: any) => ({
//         ...q,
//         answers: shuffleArray(q.answers),
//       }));

//       setQuestions(shuffledQuestions);
//     });
// }, [courseId]);

//   // =========================
//   // TIMER LOGIC GIỐNG FILE GỐC
//   // =========================
//   let timer = 10000;

//   if (selectedAnswer) {
//     timer = 1000;
//   }

//   if (
//     selectedAnswer &&
//     (answerState === "correct" ||
//       answerState === "wrong")
//   ) {
//     timer = 2000;
//   }

//   useEffect(() => {
//     if (!question) return;

//     setRemainingTime(timer);

//     const interval = setInterval(() => {
//       setRemainingTime((prev) => prev - 100);
//     }, 100);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [timer, question]);

//   useEffect(() => {
//     if (!question) return;

//     const timeout = setTimeout(() => {
//       if (!selectedAnswer) {
//         handleSkipAnswer();
//       }
//     }, timer);

//     return () => {
//       clearTimeout(timeout);
//     };
//   }, [timer, selectedAnswer, question]);

//   // =========================
//   // SKIP
//   // =========================
//   function handleSkipAnswer() {
//     setIndex((prev) => prev + 1);
//   }

//   // =========================
//   // CHỌN ĐÁP ÁN
//   // =========================
//   function handleSelectAnswer(answerId: string) {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answerId);
//     setAnswerState("answered");

//     const correctAnswer = question.answers.find(
//       (a: any) => a.isCorrect
//     );

//     setTimeout(() => {
//       const isCorrect =
//         correctAnswer?.id === answerId;

//       setAnswerState(
//         isCorrect ? "correct" : "wrong"
//       );

//       setTimeout(() => {
//         setIndex((prev) => prev + 1);
//       }, 2000);
//     }, 1000);
//   }

//   // =========================
//   // RESET KHI SANG CÂU MỚI
//   // =========================
//   useEffect(() => {
//     setSelectedAnswer("");
//     setAnswerState("");
//   }, [index]);

//   // =========================
//   // LOADING
//   // =========================
//   if (!questions.length) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         Loading...
//       </div>
//     );
//   }

//   // =========================
//   // DONE
//   // =========================
//   if (index >= questions.length) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white text-3xl font-bold">
//         QUIZ DONE
//       </div>
//     );
//   }

//   let timerColor =
//     "bg-gradient-to-r from-blue-500 to-purple-500";

//   if (answerState === "correct") {
//     timerColor = "bg-green-500";
//   }

//   if (answerState === "wrong") {
//     timerColor = "bg-red-500";
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#1F1A3A] text-white flex items-center justify-center p-4">
//       <div className="w-full max-w-xl flex flex-col items-center space-y-6">

//         <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] text-[#A78BFA] uppercase">
//          EDUCORE QUIZ
//         </h1>

//         <div className="w-full bg-[#161B30]/90 border border-[#2A3352] rounded-2xl p-6 shadow-xl">

//           {/* TIMER DUY NHẤT */}
//           <div className="w-full bg-[#242C4D] h-2 rounded-full overflow-hidden mb-6">
//             <div
//               className={`h-full transition-all duration-100 ${timerColor}`}
//               style={{
//                 width: `${(remainingTime / timer) * 100}%`,
//               }}
//             />
//           </div>

//           {/* QUESTION */}
//           <div className="text-center mb-6">
//             <h2 className="text-lg font-bold">
//               {question.question}
//             </h2>
//           </div>

//           {/* ANSWERS */}
//           <div className="space-y-3">
//             {question.answers.map((a: any) => {
//               const isSelected =
//                 selectedAnswer === a.id;

//               let btnClass =
//                 "w-full bg-white text-[#0F172A] font-semibold text-left px-5 py-3.5 rounded-xl border-2 border-transparent transition";

//               if (
//                 answerState === "answered" &&
//                 isSelected
//               ) {
//                 btnClass =
//                   "w-full bg-yellow-400 text-black font-bold text-left px-5 py-3.5 rounded-xl border-2 border-yellow-500";
//               }

//               if (
//                 answerState === "correct" &&
//                 isSelected
//               ) {
//                 btnClass =
//                   "w-full bg-green-500 text-white font-bold text-left px-5 py-3.5 rounded-xl border-2 border-green-600";
//               }

//               if (
//                 answerState === "wrong" &&
//                 isSelected
//               ) {
//                 btnClass =
//                   "w-full bg-red-500 text-white font-bold text-left px-5 py-3.5 rounded-xl border-2 border-red-600";
//               }

//               return (
//                 <button
//                   key={a.id}
//                   onClick={() =>
//                     handleSelectAnswer(a.id)
//                   }
//                   disabled={answerState !== ""}
//                   className={btnClass}
//                 >
//                   {a.text}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <p className="text-[11px] text-gray-500 font-mono tracking-widest">
//           QUESTION {index + 1} OF {questions.length}
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:3001";


function shuffleArray(arr: any[]) {

  const newArr = [...arr];

  for (
    let i = newArr.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      newArr[i],
      newArr[j],
    ] =
    [
      newArr[j],
      newArr[i],
    ];
  }

  return newArr;
}



type AnswerState =
  | ""
  | "answered"
  | "correct"
  | "wrong";



export default function QuestionAnswerPage({
  params,
}: {
  params: Promise<{ id:string }>
}) {


  const { id:courseId } =
    use(params);


  const router =
    useRouter();



  const [questions,setQuestions] =
    useState<any[]>([]);


  const [index,setIndex] =
    useState(0);



  const [selectedAnswer,setSelectedAnswer] =
    useState<string>("");



  const [answerState,setAnswerState] =
    useState<AnswerState>("");



  const [remainingTime,setRemainingTime] =
    useState(10000);



  const [userAnswers,setUserAnswers] =
    useState<any[]>([]);




  const question =
    questions[index];




  // =========================
  // FETCH QUIZ
  // =========================

  useEffect(()=>{

    fetch(
      `${BASE_URL}/courses/${courseId}/quiz`
    )

    .then(res=>res.json())

    .then(data=>{

      const shuffled =
        data.map((q:any)=>({

          ...q,

          answers:
            shuffleArray(q.answers)

        }));


      setQuestions(shuffled);

    });


  },[courseId]);







  // =========================
  // SUBMIT
  // =========================

  async function submitQuiz(
    answers:any[]
  ){

    const res =
      await fetch(

        `${BASE_URL}/courses/${courseId}/quiz/submit`,

        {

          method:"POST",

          credentials:"include",

          headers:{
            "Content-Type":
              "application/json"
          },


          body:
            JSON.stringify({
              answers
            })

        }

      );



    const data =
      await res.json();



    router.push(
      `/user/result/${data.id}`
    );

  }







  // =========================
  // TIMER
  // =========================

  let timer = 10000;


  if(selectedAnswer){
    timer = 1000;
  }


  if(
    selectedAnswer &&
    (
      answerState==="correct" ||
      answerState==="wrong"
    )
  ){

    timer = 2000;

  }





  useEffect(()=>{

    if(!question)
      return;


    setRemainingTime(timer);


    const interval =
      setInterval(()=>{

        setRemainingTime(
          prev=>prev-100
        );

      },100);


    return ()=>{
      clearInterval(interval);
    };


  },[timer,question]);







  useEffect(()=>{


    if(!question)
      return;



    const timeout =
      setTimeout(()=>{


        if(!selectedAnswer){

          handleSkipAnswer();

        }


      },timer);



    return ()=>{
      clearTimeout(timeout);
    };


  },[
    timer,
    selectedAnswer,
    question
  ]);









  // =========================
  // SKIP
  // =========================

  function handleSkipAnswer(){


    const newAnswers = [

      ...userAnswers,

      {
        questionId:
          question.id,

        answerId:null
      }

    ];



    setUserAnswers(
      newAnswers
    );




    if(
      index + 1 >= questions.length
    ){

      submitQuiz(
        newAnswers
      );

      return;

    }



    setIndex(
      prev=>prev+1
    );


  }







  // =========================
  // SELECT ANSWER
  // =========================

  function handleSelectAnswer(
    answerId:string
  ){


    if(selectedAnswer)
      return;



    setSelectedAnswer(
      answerId
    );



    setAnswerState(
      "answered"
    );




    const correctAnswer =
      question.answers.find(
        (a:any)=>
          a.isCorrect
      );




    setTimeout(()=>{


      const isCorrect =
        correctAnswer?.id === answerId;




      setAnswerState(

        isCorrect
          ? "correct"
          : "wrong"

      );




      const newAnswers = [

        ...userAnswers,

        {
          questionId:
            question.id,

          answerId
        }

      ];



      setUserAnswers(
        newAnswers
      );






      setTimeout(()=>{


        if(
          index + 1 >= questions.length
        ){


          submitQuiz(
            newAnswers
          );


          return;

        }



        setIndex(
          prev=>prev+1
        );



      },2000);




    },1000);


  }







  // RESET

  useEffect(()=>{

    setSelectedAnswer("");
    setAnswerState("");

  },[index]);








  if(!questions.length){

    return (

      <div className="min-h-screen flex items-center justify-center text-white">

        Loading...

      </div>

    );

  }








  let timerColor =
    "bg-gradient-to-r from-blue-500 to-purple-500";



  if(answerState==="correct"){

    timerColor =
      "bg-green-500";

  }



  if(answerState==="wrong"){

    timerColor =
      "bg-red-500";

  }







  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-[#0B0F19]
      via-[#111827]
      to-[#1F1A3A]
      text-white
      flex
      items-center
      justify-center
      p-4
    ">



      <div className="
        w-full
        max-w-xl
        flex
        flex-col
        items-center
        space-y-6
      ">



        <h1 className="
          text-xl
          md:text-2xl
          font-black
          tracking-[0.2em]
          text-[#A78BFA]
        ">

          EDUCORE QUIZ

        </h1>





        <div className="
          w-full
          bg-[#161B30]/90
          border
          border-[#2A3352]
          rounded-2xl
          p-6
        ">



          <div className="
            w-full
            bg-[#242C4D]
            h-2
            rounded-full
            overflow-hidden
            mb-6
          ">


            <div

              className={
                `h-full transition-all ${timerColor}`
              }


              style={{

                width:
                `${(remainingTime / timer) * 100}%`

              }}

            />


          </div>






          <div className="text-center mb-6">


            <h2 className="
              text-lg
              font-bold
            ">

              {question.question}

            </h2>


          </div>







          <div className="space-y-3">


            {question.answers.map(
              (a:any)=>{


              const isSelected =
                selectedAnswer===a.id;



              let btnClass =
              "w-full bg-white text-[#0F172A] font-semibold text-left px-5 py-3.5 rounded-xl";





              if(
                answerState==="answered"
                &&
                isSelected
              ){

                btnClass =
                "w-full bg-yellow-400 text-black font-bold px-5 py-3.5 rounded-xl";

              }





              if(
                answerState==="correct"
                &&
                isSelected
              ){

                btnClass =
                "w-full bg-green-500 text-white font-bold px-5 py-3.5 rounded-xl";

              }





              if(
                answerState==="wrong"
                &&
                isSelected
              ){

                btnClass =
                "w-full bg-red-500 text-white font-bold px-5 py-3.5 rounded-xl";

              }






              return (

                <button

                  key={a.id}

                  disabled={
                    answerState !== ""
                  }

                  onClick={()=>(
                    handleSelectAnswer(a.id)
                  )}

                  className={btnClass}

                >

                  {a.text}

                </button>

              );


            })}


          </div>



        </div>





        <p className="
          text-xs
          text-gray-500
        ">

          QUESTION {index+1}
          {" "}
          OF
          {" "}
          {questions.length}

        </p>



      </div>


    </div>

  );

}