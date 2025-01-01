import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { toPng } from 'html-to-image';
import "./RecapCard.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Recap: React.FC = () => {
  const { id64 } = useParams<{ id64: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //Image Generation
  const recapRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (recapRef.current) {
      try {
        const dataUrl = await toPng(recapRef.current, {
          width: 800,
          height: 800,
          canvasWidth: 800,
          canvasHeight: 800,
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "recap.png";
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(process.env.NODE_ENV === "production" ? `https://api.wrapped.tf/profile/${id64}` : `http://localhost:5000/profile/${id64}`);
      if (!response.ok) throw new Error("Failed to fetch profile data");
      const data = await response.json();

      // Check if data is empty
      if (!data || Object.keys(data).length === 0) {
        throw new Error("ID64 not found");
      }

      setProfileData(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const matchesPlayed = new Array(12).fill(0); // Initialize an array for all 12 months with 0

  if (profileData?.activity) {
    profileData.activity.forEach(({ month, matches_played }: any) => {
      // Month in the data is 1-based, so adjust to 0-based index
      const monthIndex = parseInt(month, 10) - 1;
      matchesPlayed[monthIndex] = matches_played;
    });
  }

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'September', 'October', 'November', 'December']
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Monthly Activity',
        data: matchesPlayed,
        backgroundColor: [
          'rgba(240, 129, 73, 0.8)'
        ],
        borderColor: [
          'rgba(163, 88, 50, 0.8)'
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio : false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const classes: Record<string, string> = {
    scout: "Scout",
    soldier: "Soldier",
    pyro: "Pyro",
    demoman: "Demoman",
    heavyweapons: "Heavy",
    engineer: "Engineer",
    medic: "Medic",
    sniper: "Sniper",
    spy: "Spy",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
  
    // Array of month names
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
  
    // Format the date
    const formattedDate = `${months[date.getMonth()]} ${day}${suffix}`;
    return formattedDate;
  };

  useEffect(() => {
    if (id64) {
      fetchProfileData();
    }
  }, [id64]);

  // Update the tab title dynamically when profileData changes
  useEffect(() => {
    if (id64 && profileData?.steamInfo?.[id64]?.name) {
      document.title = `${profileData.steamInfo[id64].name} - wrapped.tf`;
    } else {
      document.title = "recap - wrapped.tf";
    }
    return () => {
      document.title = "Wrapped.tf"; // Reset title when unmounting
    };
  }, [profileData, id64]);

  const formatNumber = (num: any) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toLocaleString(); // Use locale string for smaller numbers
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen w-full snap-start items-center md:justify-center max-md:justify-start bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-2 max-md:pt-20">
        <span className="loading loading-spinner loading-sm"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen w-full snap-start items-center md:justify-center max-md:justify-start bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-2 max-md:pt-20">
        <div className="text-error text-3xl font-londrina">{error}</div>
        <div className="text-error text-4xl font-londrina">please try refreshing</div>
      </div>
    );
  }

  if (profileData?.general.length === 0) {
    return (
      <div className="flex flex-col h-screen w-full snap-start items-center md:justify-center max-md:justify-start bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-2 max-md:pt-20">
        <div className="text-error text-4xl font-londrina">NO GAMES IN 2024</div>
        <a href="/" className="btn bg-lightscale-3 dark:bg-warmscale-8 text-warmscale-7 dark:text-lightscale-4 border-warmscale-6 dark:border-lightscale-6">View Global Stats Here</a>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen snap-y snap-mandatory overflow-y-scroll">
      {/* Overview */}
      <div className="flex flex-col h-screen w-full snap-start items-center md:justify-center max-md:justify-start bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-2 max-md:pt-20">
        <div className="max-xl:h-[70vh] max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold">
            <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            <div className="text-4xl mx-2">Overview</div>
            <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
          </div>
          <div className="w-full h-full overflow-hidden grid xl:grid-cols-2 max-xl:grid-cold-1  xl:grid-rows-2 max-xl:grid-rows-4 p-2 xl:gap-4 max-xl:gap-2">
          <div className="grid md:grid-cols-5 max-md:grid-rows-4 p-3 w-full xl:col-span-full max-xl:row-span-2 h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
              <div className="flex flex-col justify-center items-center p-2 max-md:hidden">
                <div className="w-3/4">
                  <img
                    src={`https://avatars.fastly.steamstatic.com/${
                      id64 && profileData?.steamInfo[id64]?.avatar
                    }_full.jpg`}
                    alt="Character"
                    className="max-w-1/4 max-md:w-1/4 h-auto object-contain rounded-3xl shadow-inner"
                  />
                </div>
              </div>
              <div className="flex md:flex-col justify-center items-center font-black select-none md:border-r-2 max-md:border-b-2 border-lightscale-5 dark:border-warmscale-6 max-md:gap-2">
                <div className="xl:text-[4.2vw] max-xl:text-[9.4vw] max-md:text-[8vw] xl:-mb-[2.3vw] max-xl:-my-[4.8vw] max-md:w-full max-md:text-right text-lightscale-9 dark:text-tf-orange-dark">{profileData?.general[0].matches_played ? formatNumber(profileData.general[0].matches_played) : "0"}</div>
                <div className="xl:text-[2.6vw] max-xl:text-[5.4vw] max-md:text-[8vw] max-xl:-mb-[5vw] max-md:mb-0 max-md:w-full max-md:text-left text-warmscale-5 dark:text-lightscale-3">GAMES</div>
              </div>
              <div className="flex md:flex-col justify-center items-center font-black select-none md:border-r-2 max-md:border-b-2 border-lightscale-5 dark:border-warmscale-6 max-md:gap-2">
                <div className="xl:text-[4.2vw] max-xl:text-[9.4vw] max-md:text-[8vw] xl:-mb-[2.3vw] max-xl:-my-[4.8vw] max-md:w-full max-md:text-right text-lightscale-9 dark:text-tf-orange-dark">{profileData?.general[0].time_played ? formatNumber((profileData.general[0].time_played/60/60).toFixed(0)) : "0"}</div>
                <div className="xl:text-[2.6vw] max-xl:text-[5.4vw] max-md:text-[8vw] max-xl:-mb-[5vw] max-md:mb-0 max-md:w-full max-md:text-left text-warmscale-5 dark:text-lightscale-3">HOURS</div>
              </div>
              <div className="flex md:flex-col justify-center items-center font-black select-none md:border-r-2 max-md:border-b-2 border-lightscale-5 dark:border-warmscale-6 max-md:gap-2">
                <div className="xl:text-[4.2vw] max-xl:text-[9.4vw] max-md:text-[8vw] xl:-mb-[2.3vw] max-xl:-my-[4.8vw] max-md:w-full max-md:text-right text-lightscale-9 dark:text-tf-orange-dark">{((profileData.general[0].matches_won/profileData.general[0].matches_played)*100).toFixed(0)}%</div>
                <div className="xl:text-[2.6vw] max-xl:text-[5.4vw] max-md:text-[8vw] max-xl:-mb-[5vw] max-md:mb-0 max-md:w-full max-md:text-left text-warmscale-5 dark:text-lightscale-3">WIN%</div>
              </div>
              <div className="flex md:flex-col justify-center items-center font-black select-none border-lightscale-5 dark:border-warmscale-6 max-md:gap-2">
                <div className="xl:text-[4.2vw] max-xl:text-[9.4vw] max-md:text-[8vw] xl:-mb-[2.3vw] max-xl:-my-[4.8vw] max-md:w-full max-md:text-right text-lightscale-9 dark:text-tf-orange-dark">{profileData?.general[0].kills ? ((profileData.general[0].kills + profileData.general[0].assists) / profileData.general[0].deaths).toFixed(1) : "0"}</div>
                <div className="xl:text-[2.6vw] max-xl:text-[5.4vw] max-md:text-[8vw] max-xl:-mb-[5vw] max-md:mb-0 max-md:w-full max-md:text-left text-warmscale-5 dark:text-lightscale-3">KDA</div>
              </div>
            </div>
            <div className="w-full p-2 h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
              <div className="grid xl:grid-rows-2 max-xl:grid-rows-1 max-xl:grid-cols-5 h-full w-full items-center">
                <div className="grid md:grid-cols-2 max-md:grid-rows-2 max-md:h-5/6 max-md:mt-5 md:gap-2 max-xl:col-span-2">
                <div className="flex flex-col justify-center items-center w-full h-full max-xl:order-2">
                  {/* TOP MAP Title */}
                  <div className="text-warmscale-1 dark:text-lightscale-6 font-bold lg:-mb-2 lg:text-3xl max-lg:text-2xl max-md:hidden">
                    TOP MAP
                  </div>

                  <div className="text-warmscale-5 dark:text-lightscale-2 font-bold text-center leading-none text-3xl pr-2 md:hidden">{profileData?.topFiveMaps[1]?.map_name?.toUpperCase() || "MAP NAME"}</div>
                  {/* Dynamic Map Name */}
                  <div
                    className="text-warmscale-5 dark:text-lightscale-2 font-bold text-center leading-none max-md:hidden "
                    style={{
                      fontSize: `min(calc(20vw / ${profileData?.topFiveMaps[0].map_name.length || 1}), 4rem)`, // Adjust size dynamically based on text length
                      width: "100%", // Stretches to fill available width
                      textAlign: "center", // Ensures text remains centered
                    }}
                  >
                    {profileData?.topFiveMaps[0]?.map_name?.toUpperCase() || "MAP NAME"}
                  </div>
                </div>
                  <div className="md:p-1 flex justify-center items-center max-xl:order-1 w-full h-full max-md:pr-2">
                    <img src={`/maps/${profileData?.topFiveMaps[0].map_name}.png`} alt="" className="rounded-xl w-full h-full max-h-[14vh] object-cover" />
                  </div>
                </div>
                <div className="grid grid-cols-3 max-xl:col-span-3">
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-warmscale-1 dark:text-lightscale-6 md:text-xl max-md:text-lg max-sm:text-base max-xs:text-sm">Playtime</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 text-4xl max-md:text-[8vw]">{(profileData?.topFiveMaps[0].time_played / 60 / 60).toFixed(0)}<span className="text-sm text-lightscale-6 dark:text-lightscale-8">hrs</span></div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-warmscale-1 dark:text-lightscale-6 md:text-xl max-md:text-lg max-sm:text-base max-xs:text-sm">W/L Ratio</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 text-4xl max-md:text-[8vw]">{(profileData?.topFiveMaps[0].wins / profileData?.topFiveMaps[0].matches_played * 100).toFixed(0)}%</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-warmscale-1 dark:text-lightscale-6 md:text-xl max-md:text-lg max-sm:text-base max-xs:text-sm">Matches</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 text-4xl max-md:text-[8vw]">{profileData?.topFiveMaps[0].matches_played}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-2 h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
              <div className="grid xl:grid-rows-2 max-xl:grid-rows-1 max-xl:grid-cols-5 h-full w-full items-center">
                <div className="grid md:grid-cols-2 max-md:grid-rows-2 max-md:h-5/6 max-md:mt-5 md:gap-2 max-xl:col-span-2">
                <div className="flex flex-col justify-center items-center w-full h-full max-xl:order-2">
                  {/* TOP MAP Title */}
                  <div className="text-warmscale-1 dark:text-lightscale-6 font-bold lg:-mb-2 lg:text-3xl max-lg:text-2xl max-md:hidden">
                    TOP CLASS
                  </div>
                  <div className="text-warmscale-5 dark:text-lightscale-2 font-bold text-center leading-none text-3xl pr-2 md:hidden">{profileData?.topFiveMaps[1]?.map_name?.toUpperCase() || "MAP NAME"}</div>
                  {/* Dynamic Class Name */}
                    <div
                    className="text-warmscale-5 dark:text-lightscale-2 font-bold text-center leading-none max-md:hidden "
                    style={{
                      fontSize: `min(calc(20vw / ${profileData?.topFiveClasses[0].class_name.length || 1}), 4rem)`, // Adjust size dynamically based on text length
                      width: "100%", // Stretches to fill available width
                      textAlign: "center", // Ensures text remains centered
                    }}
                    >
                      {profileData?.topFiveClasses[0].class_name?.toUpperCase() || "MAP NAME"}
                    </div>
                  </div>
                  <div className="md:p-1 flex justify-center items-center max-xl:order-1 w-full h-full max-md:pr-2">
                    <img src={`/classes/${profileData?.topFiveClasses[0].class_name}.png`} alt="" className="rounded-xl w-full h-full max-h-[14vh] object-cover" />
                  </div>
                </div>
                <div className="grid grid-cols-3 max-xl:col-span-3">
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-warmscale-1 dark:text-lightscale-6 md:text-xl max-md:text-lg max-sm:text-base max-xs:text-sm">Playtime</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 text-4xl max-md:text-[8vw]">{(profileData?.topFiveClasses[0].time_played / 60 / 60).toFixed(0)}<span className="text-sm text-lightscale-6 dark:text-lightscale-8">hrs</span></div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-warmscale-1 dark:text-lightscale-6 md:text-xl max-md:text-lg max-sm:text-base max-xs:text-sm">W/L Ratio</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 text-4xl max-md:text-[8vw]">{(profileData?.topFiveClasses[0].wins / profileData?.topFiveClasses[0].matches_played * 100).toFixed(0)}%</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-warmscale-1 dark:text-lightscale-6 md:text-xl max-md:text-lg max-sm:text-base max-xs:text-sm">Matches</div>
                    <div className="text-warmscale-5 dark:text-lightscale-2 text-4xl max-md:text-[8vw]">{profileData?.topFiveClasses[0].matches_played}</div>
                  </div>
                </div>
              </div>
            </div>            
          </div>
          <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
        </div>
      </div>

      {/* Most Played Classes New Style */}
      <div className="flex flex-col h-screen w-full snap-start items-center md:justify-center max-md:justify-start bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-2 max-md:pt-20">
        <div className="max-xl:h-[70vh] max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold">
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            <div className="text-4xl mx-2">Most Played Classes</div>
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
          </div>

          {/* Cards */}
          <div className={`w-full h-full overflow-hidden grid grid-rows-${profileData?.topFiveClasses.length || 0} p-2 xl:gap-3 max-xl:gap-2`}>
            {Array.from({ length: profileData?.topFiveClasses.length || 0 }).map((_,index:any) => (
              <div key={index} className="relative md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                <div className="absolute bottom-0 left-2 text-warmscale-5 dark:text-lightscale-3 opacity-50 ">{index+1}.</div>
                <div className="h-full w-fit flex items-center mr-2">
                  <img
                    src={`/portraits/${profileData?.topFiveClasses[index].class_name}.png`}
                    className=" xl:h-[7vh] lg:h-[10.5vh] max-lg:h-[10vh] object-cover rounded-tl-xl rounded-br-xl"
                    alt={`${profileData?.topFiveClasses[index]?.class_name} image`}
                  />
                </div>
                <div className="grid grid-cols-4 w-full h-full gap-2">

                  {/* Class Title */}
                  <div className="w-full h-full">
                    <div className="h-full text-left flex flex-col justify-center items-start">
                      <h2 className="md:text-3xl sm:text-2xl max-sm:text-lg font-semibold text-warmscale-5 dark:text-lightscale-3 -my-1">
                        {classes[profileData?.topFiveClasses[index].class_name].toUpperCase()}
                      </h2>
                      <p className="text-sm text-warmscale-2 dark:text-lightscale-5 ">
                        {(Number(profileData?.topFiveClasses[index].time_played) /60 /60).toFixed(1)}{" "}hrs
                      </p>
                      <p className="text-sm max-md:hidden text-warmscale-2 dark:text-lightscale-5">
                        {profileData?.topFiveClasses[index].matches_played} matches
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 max-md:grid-rows-3 col-span-3">
                    {/* KDA */}
                    <div className="w-full h-full flex justify-center items-center flex-wrap gap-[0.8vw]">
                      {/* Kills */}
                      <div className="flex justify-center items-center md:flex-col">
                        <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">KDA:</div>
                        <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">KILLS</div>
                        <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                          <span className="font-bold">{formatNumber(profileData?.topFiveClasses[index].kills)}</span>
                          <span className="md:hidden mx-1">/</span>
                        </div>
                      </div>

                      {/* Deaths */}
                      <div className="flex justify-center items-center md:flex-col">
                        <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">DEATHS</div>
                        <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                          <span className="font-bold">{formatNumber(profileData?.topFiveClasses[index].deaths)}</span>
                          <span className="md:hidden mx-1">/</span>
                        </div>
                      </div>

                      {/* Assists */}
                      <div className="flex justify-center items-center md:flex-col">
                        <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">ASSISTS</div>
                        <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                          <span className="font-bold">{formatNumber(profileData?.topFiveClasses[index].assists)}</span>
                        </div>
                      </div>
                    </div>

                    {/* WL index */}
                    <div className="w-full flex flex-col justify-center items-center md:mt-1.5">
                      <div className="flex justify-center items-center md:gap-4">
                        {/* Wins */}
                        <div className="flex justify-center items-center md:flex-col ">
                          <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">W/L:</div>
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">WINS</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.topFiveClasses[index].wins)}</span>
                            <span className="md:hidden mx-1">/</span>
                          </div>
                        </div>
                        {/* Losses */}
                        <div className="flex justify-center items-center md:flex-col">
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">LOSSES</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.topFiveClasses[index].losses)}</span>
                          </div>
                        </div>
                      </div>
                      {/* WL BAR */}
                      <div className="relative h-1.5 w-full flex px-2">
                        <div
                          className="bg-green-600 opacity-80 h-full rounded-l-full"
                          style={{
                            width: `${(profileData?.topFiveClasses[index].wins / 
                              (profileData?.topFiveClasses[index].wins + profileData?.topFiveClasses[index].losses)) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-red-600 opacity-80 h-full rounded-r-full"
                          style={{
                            width: `${(profileData?.topFiveClasses[index].losses / 
                              (profileData?.topFiveClasses[index].wins + profileData?.topFiveClasses[index].losses)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="w-full flex justify-center items-center">
                      {/* Damage / Heals */}
                      <div className="flex justify-center items-center md:flex-col ">
                          <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">{profileData?.topFiveClasses[index].class_name ==="medic" ? "HEALS" : "DAMAGE"}:</div>
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">{profileData?.topFiveClasses[index].class_name ==="medic" ? "HEALS" : "DAMAGE"}</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{profileData?.topFiveClasses[index].class_name ==="medic"? Number(profileData?.topFiveClasses[index].healing).toLocaleString(): Number(profileData?.topFiveClasses[index].damage).toLocaleString()}</span>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
        </div>
      </div>

      {/* Most Played Maps New Style */}
      <div className="flex flex-col h-screen  w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-[70vh] max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold">
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            <div className="text-4xl mx-2">Most Played Maps</div>
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
          </div>

          {/* Cards */}
          <div className={`w-full h-full overflow-hidden grid grid-rows-${profileData?.topFiveMaps.length} p-2 xl:gap-3 max-xl:gap-2`}>
            {Array.from({ length: profileData?.topFiveMaps.length || 0 }).map((_,index:any) => (
              <div key={index} className="relative md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                <div className="absolute bottom-0 left-2 text-warmscale-5 dark:text-lightscale-3 opacity-50 ">{index+1}.</div>
                <div className="h-full w-fit flex items-center mr-2">
                  <img
                    src={`/maps/${profileData?.topFiveMaps[index].map_name}.png`}
                    className=" xl:h-[7vh] lg:h-[10.5vh] max-lg:h-[10vh] object-cover rounded-tl-xl rounded-br-xl"
                    alt={`${profileData?.topFiveMaps[0]?.map_name} image`}
                  />
                </div>
                <div className="grid grid-cols-4 w-full h-full gap-2">
                  {/* Map Title */}
                  <div className="w-full h-full">
                    <div className="h-full text-left flex flex-col justify-center items-start">
                      <h2 className="md:text-3xl sm:text-2xl max-sm:text-lg font-semibold text-warmscale-5 dark:text-lightscale-3 -my-1">
                        {profileData?.topFiveMaps[index].map_name.toUpperCase()}
                      </h2>
                      <p className="text-sm text-warmscale-2 dark:text-lightscale-5 ">
                        {(Number(profileData?.topFiveMaps[index].time_played) /60 /60).toFixed(1)}{" "}hrs
                      </p>
                      <p className="text-sm max-md:hidden text-warmscale-2 dark:text-lightscale-5">
                        {profileData?.topFiveMaps[index].matches_played} matches
                      </p>
                    </div>
                  </div>
                  <div className="flex col-span-3">
                    {/* WL index */}
                    <div className="w-full flex flex-col justify-center items-center md:mt-1.5">
                      <div className="flex justify-center items-center md:gap-4">
                        {/* Wins */}
                        <div className="flex justify-center items-center md:flex-col ">
                          <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">W/L:</div>
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">WINS</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.topFiveMaps[index].wins)}</span>
                            <span className="md:hidden mx-1">/</span>
                          </div>
                        </div>
                        {/* Losses */}
                        <div className="flex justify-center items-center md:flex-col">
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">LOSSES</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.topFiveMaps[index].losses)}</span>
                          </div>
                        </div>
                      </div>
                      {/* WL BAR */}
                      <div className="relative h-1.5 w-full flex px-2">
                        <div
                          className="bg-green-600 opacity-80 h-full rounded-l-full"
                          style={{
                            width: `${(profileData?.topFiveMaps[index].wins / 
                              (profileData?.topFiveMaps[index].wins + profileData?.topFiveMaps[index].losses)) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-red-600 opacity-80 h-full rounded-r-full"
                          style={{
                            width: `${(profileData?.topFiveMaps[index].losses / 
                              (profileData?.topFiveMaps[index].wins + profileData?.topFiveMaps[index].losses)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
        </div>
      </div>

      {/* Most Played Teammate New Style */}
      <div className="flex flex-col h-screen w-full snap-start items-center md:justify-center max-md:justify-start bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-2 max-md:pt-20">
        <div className="max-xl:h-[70vh] max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold">
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            <div className="text-4xl mx-2">Most Played Teammates</div>
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
          </div>

          {/* Cards */}
          <div className="w-full h-full overflow-hidden grid grid-rows-5 p-2 xl:gap-3 max-xl:gap-2">
            {[0, 1, 2, 3, 4].map((section) => (
              <div key={section} className="relative md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                <div className="absolute bottom-0 left-2 text-warmscale-5 dark:text-lightscale-3 opacity-50 ">{section+1}.</div>
                <div className="h-full w-fit flex items-center mr-2">
                  <img
                    src={`https://avatars.fastly.steamstatic.com/${profileData?.teammates[section].teammate_id64 && profileData?.steamInfo[profileData?.teammates[section].teammate_id64]?.avatar}_full.jpg`}
                    className=" xl:h-[7vh] lg:h-[10.5vh] max-lg:h-[10vh] object-cover rounded-tl-xl rounded-br-xl"
                    alt={`${profileData?.steamInfo[profileData?.teammates[section].teammate_id64]?.name} avatar`}
                  />
                </div>
                <div className="grid grid-cols-4 w-full h-full gap-2">
                  {/* Map Title */}
                  <div className="w-full h-full">
                    <div className="h-full text-left flex flex-col justify-center items-start w-full">
                      <h2 className="md:text-3xl sm:text-2xl max-sm:text-lg font-semibold text-warmscale-5 dark:text-lightscale-3 -my-1 truncate overflow-hidden w-full">
                        {profileData?.steamInfo[profileData?.teammates[section].teammate_id64]?.name}
                      </h2>
                      <p className="text-sm max-md:hidden text-warmscale-2 dark:text-lightscale-5">
                        {profileData?.teammates[section].matches_played} matches
                      </p>
                    </div>
                  </div>
                  <div className="flex col-span-3">
                    {/* WL Section */}
                    <div className="w-full flex flex-col justify-center items-center md:mt-1.5">
                      <div className="flex justify-center items-center md:gap-4">
                        {/* Wins */}
                        <div className="flex justify-center items-center md:flex-col ">
                          <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">W/L:</div>
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">WINS</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.teammates[section].wins)}</span>
                            <span className="md:hidden mx-1">/</span>
                          </div>
                        </div>
                        {/* Losses */}
                        <div className="flex justify-center items-center md:flex-col">
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">LOSSES</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.teammates[section].losses)}</span>
                          </div>
                        </div>
                      </div>
                      {/* WL BAR */}
                      <div className="relative h-1.5 w-full flex px-2">
                        <div
                          className="bg-green-600 opacity-80 h-full rounded-l-full"
                          style={{
                            width: `${(profileData?.teammates[section].wins / 
                              (profileData?.teammates[section].wins + profileData?.teammates[section].losses)) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-red-600 opacity-80 h-full rounded-r-full"
                          style={{
                            width: `${(profileData?.teammates[section].losses / 
                              (profileData?.teammates[section].wins + profileData?.teammates[section].losses)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
        </div>
      </div>

      {/* Most Played Oponents New Style */}
      <div className="flex flex-col h-screen w-full snap-start items-center md:justify-center max-md:justify-start bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-2 max-md:pt-20">
        <div className="max-xl:h-[70vh] max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold">
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            <div className="text-4xl mx-2">Most Played Opponents</div>
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
          </div>

          {/* Cards */}
          <div className="w-full h-full overflow-hidden grid grid-rows-5 p-2 xl:gap-3 max-xl:gap-2">
            {[0, 1, 2, 3, 4].map((section) => (
              <div key={section} className="relative md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                <div className="absolute bottom-0 left-2 text-warmscale-5 dark:text-lightscale-3 opacity-50 ">{section+1}.</div>
                <div className="h-full w-fit flex items-center mr-2">
                  <img
                    src={`https://avatars.fastly.steamstatic.com/${profileData?.enemies[section].enemy_id64 && profileData?.steamInfo[profileData?.enemies[section].enemy_id64]?.avatar}_full.jpg`}
                    className=" xl:h-[7vh] lg:h-[10.5vh] max-lg:h-[10vh] object-cover rounded-tl-xl rounded-br-xl"
                    alt={`${profileData?.steamInfo[profileData?.enemies[section].enemy_id64]?.name} avatar`}
                  />
                </div>
                <div className="grid grid-cols-4 w-full h-full gap-2">
                  {/* Map Title */}
                  <div className="w-full h-full">
                    <div className="h-full w-full text-left flex flex-col justify-center items-start">
                      <h2 className="md:text-3xl w-full sm:text-2xl max-sm:text-lg font-semibold text-warmscale-5 dark:text-lightscale-3 -my-1 truncate overflow-hidden">
                        {profileData?.steamInfo[profileData?.enemies[section].enemy_id64]?.name}
                      </h2>
                      <p className="text-sm text-warmscale-2 dark:text-lightscale-5">
                        {profileData?.enemies[section].matches_played} matches
                      </p>
                    </div>
                  </div>
                  <div className="flex col-span-3">
                    {/* WL Section */}
                    <div className="w-full flex flex-col justify-center items-center md:mt-1.5">
                      <div className="flex justify-center items-center md:gap-4">
                        {/* Wins */}
                        <div className="flex justify-center items-center md:flex-col ">
                          <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">W/L:</div>
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">WINS</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.enemies[section].wins)}</span>
                            <span className="md:hidden mx-1">/</span>
                          </div>
                        </div>
                        {/* Losses */}
                        <div className="flex justify-center items-center md:flex-col">
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">LOSSES</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.enemies[section].losses)}</span>
                          </div>
                        </div>
                      </div>
                      {/* WL BAR */}
                      <div className="relative h-1.5 w-full flex px-2">
                        <div
                          className="bg-green-600 opacity-80 h-full rounded-l-full"
                          style={{
                            width: `${(profileData?.enemies[section].wins / 
                              (profileData?.enemies[section].wins + profileData?.enemies[section].losses)) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-red-600 opacity-80 h-full rounded-r-full"
                          style={{
                            width: `${(profileData?.enemies[section].losses / 
                              (profileData?.enemies[section].wins + profileData?.enemies[section].losses)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
        </div>
      </div>

      {/* Playing Trends New Style */}
      <div className="flex flex-col h-screen w-full snap-start items-center md:justify-center max-md:justify-start bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-2 max-md:pt-20">
        <div className="max-xl:h-[70vh] max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold">
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            <div className="text-4xl mx-2">Playing Trends</div>
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
          </div>
          <div className="relative my-2 md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
            <Bar data={data} options={options} />
          </div>
          <div className="text-warmscale-5 dark:text-lightscale-3">On {profileData?.dailyActivity[0].day ? formatDate(profileData.dailyActivity[0].day) : "No date available"}, you played {profileData?.dailyActivity[0].matches_played} games, making it your busiest day.</div>
          <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
        </div>
      </div>

      {/* Best Teammates & Enemies New Style */}
      <div className="flex flex-col h-screen w-full snap-start items-center md:justify-center max-md:justify-start bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-2 max-md:pt-20">
        <div className="max-xl:h-[70vh] max-h-full flex flex-col justify-center items-center max-xl:w-full xl:w-2/3 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold gap-4">
            <div className="flex w-full justify-center items-center">
              <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
              <div className="text-4xl mx-2">Best Winrate With</div>
              <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            </div>
            <div className="flex w-full justify-center items-center max-md:hidden">
              <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
              <div className="text-4xl mx-2">Best Winrate Against</div>
              <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            </div>
          </div>

          <div className="w-full h-full grid md:grid-cols-2 max-md:grid-rows-2 p-2">
              {/* Teammates */}
              <div className="w-full h-full overflow-hidden grid grid-rows-3 p-2 xl:gap-3 max-xl:gap-2 md:border-r-2 border-warmscale-5 dark:border-lightscale-3">
                {[0, 1, 2].map((section) => (
                  <div key={section} className="relative md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="absolute bottom-0 left-2 text-warmscale-5 dark:text-lightscale-3 opacity-50 ">{section+1}.</div>
                    <div className="h-full w-fit flex items-center mr-2">
                      <img
                        src={`https://avatars.fastly.steamstatic.com/${profileData?.winningTeammates[section].teammate_id64 && profileData?.steamInfo[profileData?.winningTeammates[section].teammate_id64]?.avatar}_full.jpg`}
                        className=" xl:h-[7vh] lg:h-[10.5vh] max-lg:h-[10vh] object-cover rounded-tl-xl rounded-br-xl"
                        alt={`${profileData?.steamInfo[profileData?.winningTeammates[section].teammate_id64]?.name} avatar`}
                      />
                    </div>
                    <div className="grid grid-cols-4 w-full h-full gap-2">
                      {/* Map Title */}
                      <div className="w-full h-full">
                        <div className="h-full w-full text-left flex flex-col justify-center items-start">
                          <h2 className="md:text-3xl w-full sm:text-2xl max-sm:text-lg font-semibold text-warmscale-5 dark:text-lightscale-3 -my-1 truncate overflow-hidden">
                            {profileData?.steamInfo[profileData?.winningTeammates[section].teammate_id64]?.name}
                          </h2>
                          <p className="text-sm text-warmscale-2 dark:text-lightscale-5">
                            {profileData?.winningTeammates[section].matches_won + profileData?.winningTeammates[section].matches_lost} matches
                          </p>
                        </div>
                      </div>
                      <div className="flex col-span-3">
                        {/* WL Section */}
                        <div className="w-full flex flex-col justify-center items-center md:mt-1.5">
                          <div className="flex justify-center items-center md:gap-4">
                            {/* Wins */}
                            <div className="flex justify-center items-center md:flex-col ">
                              <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">W/L:</div>
                              <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">WINS</div>
                              <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                                <span className="font-bold">{formatNumber(profileData?.winningTeammates[section].matches_won)}</span>
                                <span className="md:hidden mx-1">/</span>
                              </div>
                            </div>
                            {/* Losses */}
                            <div className="flex justify-center items-center md:flex-col">
                              <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">LOSSES</div>
                              <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                                <span className="font-bold">{formatNumber(profileData?.winningTeammates[section].matches_lost)}</span>
                              </div>
                            </div>
                          </div>
                          {/* WL BAR */}
                          <div className="relative h-1.5 w-full flex px-2">
                            <div
                              className="bg-green-600 opacity-80 h-full rounded-l-full"
                              style={{
                                width: `${(profileData?.winningTeammates[section].matches_won / 
                                  (profileData?.winningTeammates[section].matches_won + profileData?.winningTeammates[section].matches_lost)) * 100}%`,
                              }}
                            ></div>
                            <div
                              className="bg-red-600 opacity-80 h-full rounded-r-full"
                              style={{
                                width: `${(profileData?.winningTeammates[section].matches_lost / 
                                  (profileData?.winningTeammates[section].matches_won + profileData?.winningTeammates[section].matches_lost)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                <div>
                  <div className="flex w-full justify-center items-center md:hidden text-warmscale-5 dark:text-lightscale-3">
                    <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
                    <div className="text-4xl mx-2">Best Winrate Against</div>
                    <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
                  </div>
                  {/* Enemies */}
              <div className="w-full h-full overflow-hidden grid grid-rows-3 p-2 xl:gap-3 max-xl:gap-2">
                {[0, 1, 2].map((section) => (
                  <div key={section} className="relative md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="absolute bottom-0 left-2 text-warmscale-5 dark:text-lightscale-3 opacity-50 ">{section+1}.</div>
                    <div className="h-full w-fit flex items-center mr-2">
                      <img
                        src={`https://avatars.fastly.steamstatic.com/${profileData?.winningEnemies[section].enemy_id64 && profileData?.steamInfo[profileData?.winningEnemies[section].enemy_id64]?.avatar}_full.jpg`}
                        className=" xl:h-[7vh] lg:h-[10.5vh] max-lg:h-[10vh] object-cover rounded-tl-xl rounded-br-xl"
                        alt={`${profileData?.steamInfo[profileData?.winningEnemies[section].enemy_id64]?.name} avatar`}
                      />
                    </div>
                    <div className="grid grid-cols-4 w-full h-full gap-2">
                      {/* Map Title */}
                      <div className="w-full h-full">
                        <div className="h-full w-full text-left flex flex-col justify-center items-start">
                          <h2 className="md:text-3xl w-full sm:text-2xl max-sm:text-lg font-semibold text-warmscale-5 dark:text-lightscale-3 -my-1 truncate overflow-hidden">
                            {profileData?.steamInfo[profileData?.winningEnemies[section].enemy_id64]?.name}
                          </h2>
                          <p className="text-sm text-warmscale-2 dark:text-lightscale-5">
                            {profileData?.winningEnemies[section].matches_won + profileData?.winningEnemies[section].matches_lost} matches
                          </p>
                        </div>
                      </div>
                      <div className="flex col-span-3">
                        {/* WL Section */}
                        <div className="w-full flex flex-col justify-center items-center md:mt-1.5">
                          <div className="flex justify-center items-center md:gap-4">
                            {/* Wins */}
                            <div className="flex justify-center items-center md:flex-col ">
                              <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">W/L:</div>
                              <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">WINS</div>
                              <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                                <span className="font-bold">{formatNumber(profileData?.winningEnemies[section].matches_won)}</span>
                                <span className="md:hidden mx-1">/</span>
                              </div>
                            </div>
                            {/* Losses */}
                            <div className="flex justify-center items-center md:flex-col">
                              <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">LOSSES</div>
                              <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                                <span className="font-bold">{formatNumber(profileData?.winningEnemies[section].matches_lost)}</span>
                              </div>
                            </div>
                          </div>
                          {/* WL BAR */}
                          <div className="relative h-1.5 w-full flex px-2">
                            <div
                              className="bg-green-600 opacity-80 h-full rounded-l-full"
                              style={{
                                width: `${(profileData?.winningEnemies[section].matches_won / 
                                  (profileData?.winningEnemies[section].matches_won + profileData?.winningEnemies[section].matches_lost)) * 100}%`,
                              }}
                            ></div>
                            <div
                              className="bg-red-600 opacity-80 h-full rounded-r-full"
                              style={{
                                width: `${(profileData?.winningEnemies[section].matches_lost / 
                                  (profileData?.winningEnemies[section].matches_won + profileData?.winningEnemies[section].matches_lost)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                </div>
              
          </div>

          <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
        </div>
      </div>

      {/* Worst Teammates & Enemies New Style */}
      <div className="flex flex-col h-screen w-full snap-start items-center md:justify-center max-md:justify-start bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-2 max-md:pt-20">
        <div className="max-xl:h-[70vh] max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-2/3 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold gap-4">
            <div className="flex w-full justify-center items-center">
              <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
              <div className="text-4xl mx-2">Worst Winrate With</div>
              <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            </div>
            <div className="flex w-full justify-center items-center max-md:hidden">
              <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
              <div className="text-4xl mx-2">Worst Winrate Against</div>
              <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            </div>
          </div>

            <div className="w-full h-full grid md:grid-cols-2 max-md:grid-rows-2 p-2">
              {/* Teammates */}
              <div className="w-full h-full overflow-hidden grid grid-rows-3 p-2 xl:gap-3 max-xl:gap-2 md:border-r-2 border-warmscale-5 dark:border-lightscale-3">
                {[0, 1, 2].map((section) => (
                  <div key={section} className="relative md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="absolute bottom-0 left-2 text-warmscale-5 dark:text-lightscale-3 opacity-50 ">{section+1}.</div>
                    <div className="h-full w-fit flex items-center mr-2">
                      <img
                        src={`https://avatars.fastly.steamstatic.com/${profileData?.losingTeammates[section].teammate_id64 && profileData?.steamInfo[profileData?.losingTeammates[section].teammate_id64]?.avatar}_full.jpg`}
                        className=" xl:h-[7vh] lg:h-[10.5vh] max-lg:h-[10vh] object-cover rounded-tl-xl rounded-br-xl"
                        alt={`${profileData?.steamInfo[profileData?.losingTeammates[section].teammate_id64]?.name} avatar`}
                      />
                    </div>
                    <div className="grid grid-cols-4 w-full h-full gap-2">
                      {/* Map Title */}
                      <div className="w-full h-full">
                        <div className="h-full w-full text-left flex flex-col justify-center items-start">
                          <h2 className="md:text-3xl w-full sm:text-2xl max-sm:text-lg font-semibold text-warmscale-5 dark:text-lightscale-3 -my-1 truncate overflow-hidden">
                            {profileData?.steamInfo[profileData?.losingTeammates[section].teammate_id64]?.name}
                          </h2>
                          <p className="text-sm text-warmscale-2 dark:text-lightscale-5">
                            {profileData?.losingTeammates[section].matches_won + profileData?.losingTeammates[section].matches_lost} matches
                          </p>
                        </div>
                      </div>
                      <div className="flex col-span-3">
                        {/* WL Section */}
                        <div className="w-full flex flex-col justify-center items-center md:mt-1.5">
                          <div className="flex justify-center items-center md:gap-4">
                            {/* Wins */}
                            <div className="flex justify-center items-center md:flex-col ">
                              <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">W/L:</div>
                              <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">WINS</div>
                              <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                                <span className="font-bold">{formatNumber(profileData?.losingTeammates[section].matches_won)}</span>
                                <span className="md:hidden mx-1">/</span>
                              </div>
                            </div>
                            {/* Losses */}
                            <div className="flex justify-center items-center md:flex-col">
                              <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">LOSSES</div>
                              <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                                <span className="font-bold">{formatNumber(profileData?.losingTeammates[section].matches_lost)}</span>
                              </div>
                            </div>
                          </div>
                          {/* WL BAR */}
                          <div className="relative h-1.5 w-full flex px-2">
                            <div
                              className="bg-green-600 opacity-80 h-full rounded-l-full"
                              style={{
                                width: `${(profileData?.losingTeammates[section].matches_won / 
                                  (profileData?.losingTeammates[section].matches_won + profileData?.losingTeammates[section].matches_lost)) * 100}%`,
                              }}
                            ></div>
                            <div
                              className="bg-red-600 opacity-80 h-full rounded-r-full"
                              style={{
                                width: `${(profileData?.losingTeammates[section].matches_lost / 
                                  (profileData?.losingTeammates[section].matches_won + profileData?.losingTeammates[section].matches_lost)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                <div>
                  <div className="flex w-full justify-center items-center md:hidden text-warmscale-5 dark:text-lightscale-3">
                    <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
                    <div className="text-4xl mx-2">Worst Winrate Against</div>
                    <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
                  </div>
                  {/* Enemies */}
              <div className="w-full h-full overflow-hidden grid grid-rows-3 p-2 xl:gap-3 max-xl:gap-2">
                {[0, 1, 2].map((section) => (
                  <div key={section} className="relative md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="absolute bottom-0 left-2 text-warmscale-5 dark:text-lightscale-3 opacity-50 ">{section+1}.</div>
                    <div className="h-full w-fit flex items-center mr-2">
                      <img
                        src={`https://avatars.fastly.steamstatic.com/${profileData?.losingEnemies[section].enemy_id64 && profileData?.steamInfo[profileData?.losingEnemies[section].enemy_id64]?.avatar}_full.jpg`}
                        className=" xl:h-[7vh] lg:h-[10.5vh] max-lg:h-[10vh] object-cover rounded-tl-xl rounded-br-xl"
                        alt={`${profileData?.steamInfo[profileData?.losingEnemies[section].enemy_id64]?.name} avatar`}
                      />
                    </div>
                    <div className="grid grid-cols-4 w-full h-full gap-2">
                      {/* Map Title */}
                      <div className="w-full h-full">
                        <div className="h-full w-full text-left flex flex-col justify-center items-start">
                          <h2 className="md:text-3xl w-full sm:text-2xl max-sm:text-lg font-semibold text-warmscale-5 dark:text-lightscale-3 -my-1 truncate overflow-hidden">
                            {profileData?.steamInfo[profileData?.losingEnemies[section].enemy_id64]?.name}
                          </h2>
                          <p className="text-sm text-warmscale-2 dark:text-lightscale-5">
                            {profileData?.losingEnemies[section].matches_won + profileData?.losingEnemies[section].matches_lost} matches
                          </p>
                        </div>
                      </div>
                      <div className="flex col-span-3">
                        {/* WL Section */}
                        <div className="w-full flex flex-col justify-center items-center md:mt-1.5">
                          <div className="flex justify-center items-center md:gap-4">
                            {/* Wins */}
                            <div className="flex justify-center items-center md:flex-col ">
                              <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">W/L:</div>
                              <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">WINS</div>
                              <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                                <span className="font-bold">{formatNumber(profileData?.losingEnemies[section].matches_won)}</span>
                                <span className="md:hidden mx-1">/</span>
                              </div>
                            </div>
                            {/* Losses */}
                            <div className="flex justify-center items-center md:flex-col">
                              <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">LOSSES</div>
                              <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                                <span className="font-bold">{formatNumber(profileData?.losingEnemies[section].matches_lost)}</span>
                              </div>
                            </div>
                          </div>
                          {/* WL BAR */}
                          <div className="relative h-1.5 w-full flex px-2">
                            <div
                              className="bg-green-600 opacity-80 h-full rounded-l-full"
                              style={{
                                width: `${(profileData?.losingEnemies[section].matches_won / 
                                  (profileData?.losingEnemies[section].matches_won + profileData?.losingEnemies[section].matches_lost)) * 100}%`,
                              }}
                            ></div>
                            <div
                              className="bg-red-600 opacity-80 h-full rounded-r-full"
                              style={{
                                width: `${(profileData?.losingEnemies[section].matches_lost / 
                                  (profileData?.losingEnemies[section].matches_won + profileData?.losingEnemies[section].matches_lost)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                </div>
            </div>
          <div className="h-[2px] w-full bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
        </div>
      </div>
      
      {/* Share */}
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark font-londrina bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-[70vh] max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-2/3 xl:h-4/6 max-md:mb-20">
          <div className="w-full h-full md:h-1/2 md:w-1/2 flex flex-col justify-center items-center p-2">
            <div className="w-full h-fit flex justify-center items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold gap-4">
              <div className="text-4xl mx-2 mb-3">Download & Share</div></div>
              <div className="flex flex-col items-center justify-center w-fit h-fit">
                {/* Recap Card */}
                <div className=" lg:scale-[0.8] lg:-m-[80px] md:scale-[0.7] md:-m-[120px] sm:scale-[0.6] sm:-m-[160px] max-md:scale-[0.4] max-md:-m-[240px]" >
                  <div
                    ref={recapRef}
                    className="w-[800px] h-[800px] border-4 border-tf-orange bg-white rounded-md shadow-lg flex flex-col justify-center items-center"
                  >
                    <div className="relative h-full w-full bg-warmscale-7 bg-topo-dark">
                      <div className="w-full h-full absolute bg-black bg-opacity-50"></div>
                      <div className="line top"></div>
                      <div className="content"></div>
                      <div className="line bottom"></div>

                      <div className="moretf-logo"></div>
                      <div className="text tf2wrapped">#TF2Wrapped</div>
                      <div className="text tf2wrapped-small-text">My 2024 more.tf wrapped</div>

                      <div className="line bottom-left"></div>
                      <div className="text bottom-left">Get yours at <span>wrapped.tf</span></div>

                      <div className="flex justify-center items-center absolute right-[4%] top-[5%] gap-2 bg-tf-orange p-1 rounded-sm">
                          <img src={`https://avatars.fastly.steamstatic.com/${ id64 && profileData?.steamInfo[id64]?.avatar}_full.jpg`} alt="icon" className="card-icon" />
                          <span className=" font-istok text-white font-semibold">{id64 && profileData?.steamInfo[id64]?.name}</span>
                      </div>

                      <div className="text minutes-played-header">MINUTES PLAYED</div>
                      <div className="text that-is">THAT'S:</div>
                      <div className="text key-insights">KEY INSIGHTS</div>

                      <div className="text minutes-played">{Math.round(profileData?.general[0].time_played/60).toLocaleString()}</div>
                      <div className="text movies-missed">movies missed</div>
                      <div className="card movies-missed">{Math.round(profileData?.general[0].time_played/60/90).toLocaleString()}</div>

                      <div className="text hours-played">total hours</div>
                      <div className="card hours-played">{Math.round(profileData?.general[0].time_played/60/60).toLocaleString()}</div>

                      <div className="text top-map-header">TOP MAP</div>
                      <div className="text-tf-orange absolute right-[4%] top-[41%] w-[300px]" style={{
                        fontSize: `min(calc(600px / ${profileData?.topFiveMaps[0].map_name.length || 1}), 70px)`,
                        textAlign: "right", // Ensures text remains centered
                      }}>{profileData?.topFiveMaps[0].map_name.toUpperCase()}</div>

                      <div className="text top-class-header">TOP CLASS</div>
                      <div className="text top-class">{profileData?.topFiveClasses[0].class_name.toUpperCase()}</div>

                      <div className="rectangle">
                          <img src={`/maps/${profileData?.topFiveMaps[0].map_name}.png`} alt="Product"/>
                      </div>
                      <div className="line map-1"></div>
                      <div className="line map-2"></div>
                      <div className="line map-3"></div>

                      <div className="stat map-1">
                          <div className="value">{(Number(profileData?.topFiveMaps[0].time_played) /60 /60).toFixed(1)}{" "}hrs</div>
                          <div className="textbox">Playtime</div>
                      </div>

                      <div className="stat map-2">
                          <div className="value">{Math.round(profileData?.topFiveMaps[0].wins / 
                                (profileData?.topFiveMaps[0].wins + profileData?.topFiveMaps[0].losses)*100)}%</div>
                          <div className="textbox">W/L Ratio</div>
                      </div>

                      <div className="stat map-3">
                          <div className="value">{profileData?.topFiveMaps[0].matches_played}</div>
                          <div className="textbox">Matches</div>
                      </div>

                      <div className="line class-1"></div>
                      <div className="line class-2"></div>
                      <div className="line class-3"></div>

                      <div className="stat class-1">
                          <div className="textbox">Playtime</div>
                          <div className="value">{(Number(profileData?.topFiveClasses[0].time_played) /60 /60).toFixed(1)}{" "}hrs</div>
                      </div>

                      <div className="stat class-2">
                          <div className="textbox">W/L Ratio</div>
                          <div className="value">{Math.round(profileData?.topFiveClasses[0].wins / 
                                (profileData?.topFiveClasses[0].wins + profileData?.topFiveClasses[0].losses)*100)}%</div>
                      </div>

                      <div className="stat class-3">
                          <div className="textbox">Matches</div>
                          <div className="value">{profileData?.topFiveClasses[0].matches_played}</div>
                      </div>

                      <div className="rectangle-class">
                          <img src={`/classes/${profileData?.topFiveClasses[0].class_name}.png`} alt="Demoman"/>
                      </div>

                      <div className="text kda">KDA</div>
                      <div className="text kda-value">{profileData?.general[0].kills ? ((profileData.general[0].kills + profileData.general[0].assists) / profileData.general[0].deaths).toFixed(1) : "0"}</div>
                      <div className="text win-percent">WIN %</div>
                      <div className="text win-percent-value">{((profileData.general[0].matches_won/profileData.general[0].matches_played)*100).toFixed(0)}%</div>

                      <div className="text games">GAMES</div>
                      <div className="text games-value">{profileData.general[0].matches_played}</div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownloadImage}
                  className="mt-6 px-4 py-2 bg-tf-orange text-warmscale-5 rounded hover:scale-110 duration-100 shadow-md"
                >
                  Download Recap
                </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Recap;
