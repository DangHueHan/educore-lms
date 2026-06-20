// import React from "react";
// import {
//   Search,
//   Phone,
//   Mail,
//   MapPin,
// } from "lucide-react";

// export default function App() {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* ========================================== */}
//       {/* 1. THANH ĐIỀU HƯỚNG (NAVIGATION)         */}
//       {/* ========================================== */}
     


// <div className="w-full min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#1F1A3A] text-white font-sans flex flex-col items-center justify-center p-4 antialiased select-none">
      
//       {/* Khung bao ngoài - Đồng bộ độ rộng max-w-xl gọn gàng */}
//       <div className="w-full max-w-xl flex flex-col items-center space-y-6">
        
//         {/* Tiêu đề hoàn thành bài Quiz */}
//         <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] text-[#A78BFA] uppercase text-center drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]">
//           Quiz Completed!
//         </h1>

//         {/* Khung chính màu xanh đen đồng bộ layout trước */}
//         <div className="w-full bg-[#161B30]/90 border border-[#2A3352] rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md space-y-8">
          
//           {/* Tóm tắt chỉ số phần trăm số câu (Skipped, Correct, Incorrect) */}
//           <div className="grid grid-cols-3 gap-2 text-center pb-6 border-b border-[#2A3352]">
//             <div>
//               <p className="text-xl md:text-2xl font-black font-mono text-purple-400">14%</p>
//               <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">Skipped</p>
//             </div>
//             <div>
//               <p className="text-xl md:text-2xl font-black font-mono text-emerald-400">14%</p>
//               <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">Correct</p>
//             </div>
//             <div>
//               <p className="text-xl md:text-2xl font-black font-mono text-rose-400">72%</p>
//               <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">Incorrect</p>
//             </div>
//           </div>

//           {/* Danh sách review chi tiết từng câu hỏi - ĐÃ BỎ THANH TRƯỢT THẤY GỚM */}
//           <div className="space-y-6">
            
//             {/* Câu số 1 - TRẢ LỜI ĐÚNG */}
//             <div className="space-y-2 text-center">
//               <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#242C4D] text-xs font-bold font-mono text-gray-300">
//                 1
//               </div>
//               <p className="text-[13.5px] font-semibold text-gray-300">
//                 Trong JavaScript, console.log() thường được dùng để làm gì?
//               </p>
//               <p className="text-[13.5px] font-bold text-emerald-400">
//                 In ra thông tin để kiểm tra lỗi hoặc giá trị biến.
//               </p>
//             </div>

//             {/* Câu số 2 - BỎ QUA */}
//             <div className="space-y-2 text-center pt-4 border-t border-[#242C4D]">
//               <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#242C4D] text-xs font-bold font-mono text-gray-300">
//                 2
//               </div>
//               <p className="text-[13.5px] font-semibold text-gray-300">
//                 "Component" trong ứng dụng web có thể hiểu đơn giản là gì?
//               </p>
//               <p className="text-[13.5px] font-bold text-purple-400 italic">
//                 Skipped
//               </p>
//             </div>

//             {/* Câu số 3 - TRẢ LỜI SAI */}
//             <div className="space-y-2 text-center pt-4 border-t border-[#242C4D]">
//               <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#242C4D] text-xs font-bold font-mono text-gray-300">
//                 3
//               </div>
//               <p className="text-[13.5px] font-semibold text-gray-300">
//                 Khi nói "state" của một component, điều nào sau đây hợp lý nhất?
//               </p>
//               <p className="text-[13.5px] font-bold text-rose-400">
//                 Tên thư mục gốc của dự án.
//               </p>
//             </div>

//             {/* Câu số 4 - TRẢ LỜI SAI */}
//             <div className="space-y-2 text-center pt-4 border-t border-[#242C4D]">
//               <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#242C4D] text-xs font-bold font-mono text-gray-300">
//                 4
//               </div>
//               <p className="text-[13.5px] font-semibold text-gray-300">
//                 Bạn thường hiển thị danh sách từ một mảng như thế nào?
//               </p>
//               <p className="text-[13.5px] font-bold text-rose-400">
//                 Dùng setTimeout để chèn từng phần tử sau mỗi 1 giây.
//               </p>
//             </div>

//             {/* Câu số 5 - TRẢ LỜI SAI */}
//             <div className="space-y-2 text-center pt-4 border-t border-[#242C4D]">
//               <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#242C4D] text-xs font-bold font-mono text-gray-300">
//                 5
//               </div>
//               <p className="text-[13.5px] font-semibold text-gray-300">
//                 Cách đơn giản để hiển thị nội dung "có điều kiện" là gì?
//               </p>
//               <p className="text-[13.5px] font-bold text-rose-400">
//                 Đổi tên file từ .js sang .jsx là được.
//               </p>
//             </div>

//           </div>

//         </div>

//         {/* Bản quyền nhỏ bên dưới */}
//         <p className="text-[11px] text-gray-500 font-mono tracking-widest">
//       EDUCORE QUIZ SYSTEM
//         </p>

//       </div>
//     </div>

      
      
    
//     </div>
//   );
// }
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const BASE_URL = "http://localhost:3001";



export default function ResultPage() {


  const params = useParams();

  const id = params.id as string;



  const [result,setResult] =
    useState<any>(null);


  const [loading,setLoading] =
    useState(true);





  useEffect(()=>{


    async function loadResult(){


      const res =
      await fetch(
        `${BASE_URL}/quiz/result/${id}`,
        {
          credentials:"include"
        }
      );



      const data =
        await res.json();



      setResult(data);

      setLoading(false);

    }



    if(id){

      loadResult();

    }


  },[id]);







  if(loading){


    return (

      <div className="
        min-h-screen
        bg-[#0B0F19]
        text-white
        flex
        items-center
        justify-center
      ">

        Loading...

      </div>

    );

  }






  if(!result){


    return (

      <div className="
        min-h-screen
        bg-[#0B0F19]
        text-white
        flex
        items-center
        justify-center
      ">

        Không có kết quả

      </div>

    );

  }







  const skipped =
    result.details.filter(
      (item:any)=>
        !item.selectedAnswerId
    ).length;




  const correct =
    result.correctAnswers;




  const wrong =
    result.totalQuestions
    -
    correct
    -
    skipped;







  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-[#0B0F19]
      via-[#111827]
      to-[#1F1A3A]
      text-white
      flex
      justify-center
      p-4
    ">


      <div className="
        w-full
        max-w-xl
        mt-10
        space-y-6
      ">





        <h1 className="
          text-xl
          md:text-2xl
          font-black
          tracking-[0.2em]
          text-[#A78BFA]
          text-center
        ">

          QUIZ COMPLETED

        </h1>







        <div className="
          bg-[#161B30]/90
          border
          border-[#2A3352]
          rounded-2xl
          p-6
        ">






          {/* SUMMARY */}

          <div className="
            grid
            grid-cols-3
            text-center
            border-b
            border-[#2A3352]
            pb-6
          ">



            <div>

              <p className="
                text-2xl
                font-black
                text-purple-400
              ">

                {skipped}

              </p>

              <p className="text-xs text-gray-400">

                Skipped

              </p>


            </div>






            <div>


              <p className="
                text-2xl
                font-black
                text-green-400
              ">

                {correct}

              </p>


              <p className="text-xs text-gray-400">

                Correct

              </p>


            </div>






            <div>


              <p className="
                text-2xl
                font-black
                text-red-400
              ">

                {wrong}

              </p>


              <p className="text-xs text-gray-400">

                Wrong

              </p>


            </div>



          </div>









          {/* SCORE */}

          <div className="
            text-center
            py-8
          ">


            <p className="
              text-6xl
              font-black
            ">

              {result.score}%

            </p>



            <p
              className={
                result.passed
                ?
                "text-green-400 font-bold"
                :
                "text-red-400 font-bold"
              }
            >

              {
                result.passed
                ?
                "PASSED"
                :
                "FAILED"
              }


            </p>



          </div>









          {/* DETAIL */}

          <div className="space-y-6">



          {
            result.details.map(
              (
                item:any,
                index:number
              )=>(



              <div

                key={item.id}

                className="
                  border-t
                  border-[#242C4D]
                  pt-5
                  text-center
                "

              >



                <div className="
                  inline-flex
                  items-center
                  justify-center
                  w-6
                  h-6
                  rounded-full
                  bg-[#242C4D]
                  text-xs
                ">

                  {index+1}

                </div>






                <p className="
                  text-gray-300
                  font-semibold
                  text-sm
                  mt-3
                ">


                  {item.question.question}


                </p>







                {
                  !item.selectedAnswerId

                  ?

                  <p className="
                    text-purple-400
                    font-bold
                    mt-2
                  ">

                    Skipped

                  </p>



                  :



                  <p
                    className={

                      item.isCorrect

                      ?

                      "text-green-400 font-bold mt-2"

                      :

                      "text-red-400 font-bold mt-2"

                    }
                  >


                    {item.answer?.text}


                  </p>

                }





              </div>



            ))

          }



          </div>






        </div>





        <p className="
          text-center
          text-xs
          text-gray-500
          tracking-widest
        ">

          EDUCORE QUIZ SYSTEM

        </p>




      </div>



    </div>

  );

}