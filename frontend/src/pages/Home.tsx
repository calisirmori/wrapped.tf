import React from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
  } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data: any = {
    labels: ["6s", "HL", "2s", "PASS Time", "Other", "4s"],
    datasets: [
      {
        label: "Matches",
        data: [129414, 43419, 11618, 9354, 4160, 2150],
        backgroundColor: [
          "#A35832",
          "#f08149",
          "#bd3b3b",
          "#dabdab",
          "#6a4535",
          "#c1a18a"
        ],
        hoverOffset: 4,
        borderWidth: 0
      }
    ]
  };
  const options: any = {
    plugins: {
      legend: {
        display: false // Hides the legend
      },
      tooltip: {
        enabled: true
      },
      datalabels: {
        display: true, // Enables labels
        color: "#ECEBE9", // Label color
        font: {
          size: 12,
          weight: "bold"
        },
        formatter: (value:any, context:any) => {
          const label = context.chart.data.labels[context.dataIndex];
          return value > 10000 ? `${label}` : '';
        }
      }
    },
    maintainAspectRatio: false,
    cutout: "50%" // Adjusts the thickness of the donut
  };

const Home: React.FC = () => {
  return (
    <div className="h-screen snap-start flex items-center justify-center">
      {/* Global Info */}
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-5/6 max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold">
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            <div className="text-4xl mx-2 text">2024 Wrapped!</div>
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
          </div>

          <div className="w-full h-full grid grid-rows-3 gap-2 mb-4 max-md:mt-4">
            <div className="w-full h-full grid grid-cols-2 gap-2">
                <div className="md:my-2 md:p-3 max-md:px-2 flex flex-col justify-center items-center w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-3xl max-md:text-xl">TOTAL KILLS</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 md:text-5xl  max-md:text-3xl">
                        <CountUp start={0} end={61351245} duration={1.5} separator="," />
                    </div>
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-lg  max-md:text-base">Now thats a lot of kills</div>
                </div>
                <div className="md:my-2 md:p-3 max-md:px-2 flex flex-col justify-center items-center w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-3xl max-md:text-xl">HOURS PLAYED</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 md:text-5xl  max-md:text-3xl">
                        <CountUp start={0} end={909969} duration={1.5} separator="," />
                    </div>
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-lg  max-md:text-base">Thats 104 years!</div>
                </div>
            </div>
            <div className="w-full h-full grid grid-cols-3 gap-2">
                <div className="md:my-2 md:p-3 max-md:px-2 flex flex-col justify-center items-center w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-3xl max-md:text-xl">PLAYERS</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 md:text-5xl  max-md:text-3xl">
                        <CountUp start={0} end={20963} duration={1.5} separator=","/>
                    </div>
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-lg  max-md:text-base"></div>
                </div>

                {/* Donut Chart Card */}
                <div className="relative md:my-2 flex flex-col justify-center items-center w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="text-warmscale-1 dark:text-lightscale-5 md:text-xl max-md:text-xs">MATCHES BY FORMAT</div>
                  <div className="flex justify-center items-center w-full h-full md:max-w-[200px] md:max-h-[100px] max-md:w-[100px] max-md:h-[110px] opacity-90">
                    <Doughnut data={data} options={options} />
                  </div>
                </div>
                
                <div className="md:my-2 md:p-3 max-md:px-2 flex flex-col justify-center items-center w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-3xl max-md:text-xl">MATCHES</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 md:text-5xl  max-md:text-3xl">
                        <CountUp start={0} end={200115} duration={1.5} separator=","/>
                    </div>
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-lg  max-md:text-base"></div>
                </div>
            </div>
            <div className="w-full h-full grid grid-cols-2 gap-2">
                <div className="md:my-2 md:p-3 max-md:px-2 flex flex-col justify-center items-center w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-3xl max-md:text-xl">DAMAGE DEALT</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 md:text-5xl  max-md:text-3xl">
                        <div className="md:hidden">8.6 Billion</div>
                        <CountUp start={0} end={8632980467} duration={1.5} separator="," className="max-md:hidden"/>
                    </div>
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-lg  max-md:text-base">Ouch!</div>
                </div>
                <div className="md:my-2 md:p-3 max-md:px-2 flex flex-col justify-center items-center w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-3xl max-md:text-xl">HEALING DONE</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 md:text-5xl  max-md:text-3xl">
                        <div className="md:hidden">19.1 Billion</div>
                        <CountUp start={0} end={19065346122} duration={1.5} separator="," className="max-md:hidden"/>
                    </div>
                    <div className="text-warmscale-1 dark:text-lightscale-5 md:text-lg  max-md:text-base">Thank you medics!</div>
                </div>
            </div>
          </div>
          <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
