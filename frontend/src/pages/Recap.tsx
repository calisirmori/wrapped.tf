import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { toPng } from 'html-to-image';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Recap: React.FC = () => {
  const { id64 } = useParams<{ id64: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //Image Generation
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/profile/${id64}`);
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

  // Load recap-card.html and inject into DOM
  const loadRecapCardHTML = async () => {
    try {
      const response = await fetch("/recap-card.html"); // Fetch the HTML file from the public folder
      if (!response.ok) throw new Error("Failed to load recap-card.html");
      const html = await response.text();

      if (profileCardRef.current) {
        profileCardRef.current.innerHTML = html;

        // Populate placeholders with profile data
        const avatar = profileCardRef.current.querySelector("#avatar") as HTMLImageElement;
        const name = profileCardRef.current.querySelector("#name") as HTMLElement;
        const matches = profileCardRef.current.querySelector("#matches") as HTMLElement;
        const hours = profileCardRef.current.querySelector("#hours") as HTMLElement;

        if (profileData) {
          avatar.src = `https://avatars.fastly.steamstatic.com/${profileData.avatar}_full.jpg`;
          name.textContent = profileData.name || "Player Name";
          matches.textContent = `Games Played: ${profileData.matches_played || 0}`;
          hours.textContent = `Hours Played: ${(profileData.time_played / 3600).toFixed(1) || 0}`;
        }
      }
    } catch (error) {
      console.error("Error loading recap-card.html:", error);
    }
  };

  // Generate image from the HTML
  const generateImage = async () => {
    if (profileCardRef.current) {
      try {
        const dataUrl = await toPng(profileCardRef.current, { backgroundColor: "#fff" });
        setImageDataUrl(dataUrl);
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };
  
  console.log(imageDataUrl);

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

  useEffect(() => {
    if (profileData) {
      loadRecapCardHTML();
    }
  }, [profileData]);

  useEffect(() => {
    if (profileCardRef.current) {
      generateImage();
    }
  }, [profileCardRef]);

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
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <span className="loading loading-spinner loading-sm"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="text-error text-4xl font-londrina">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen snap-y snap-mandatory overflow-y-scroll">
      {/* Overview */}
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-5/6 max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
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
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-5/6 max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold">
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            <div className="text-4xl mx-2">Most Played Classes</div>
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
          </div>

          {/* Cards */}
          <div className="w-full h-full overflow-hidden grid grid-rows-5 p-2 xl:gap-3 max-xl:gap-2">
            {[0, 1, 2, 3, 4].map((section) => (
              <div key={section} className="relative md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                <div className="absolute bottom-0 left-2 text-warmscale-5 dark:text-lightscale-3 opacity-50 ">{section+1}.</div>
                <div className="h-full w-fit flex items-center mr-2">
                  <img
                    src={`/portraits/${profileData?.topFiveClasses[section].class_name}.png`}
                    className=" xl:h-[7vh] lg:h-[10.5vh] max-lg:h-[10vh] object-cover rounded-tl-xl rounded-br-xl"
                    alt={`${profileData?.topFiveClasses[0]?.class_name} image`}
                  />
                </div>
                <div className="grid grid-cols-4 w-full h-full gap-2">

                  {/* Class Title */}
                  <div className="w-full h-full">
                    <div className="h-full text-left flex flex-col justify-center items-start">
                      <h2 className="md:text-3xl sm:text-2xl max-sm:text-lg font-semibold text-warmscale-5 dark:text-lightscale-3 -my-1">
                        {classes[profileData?.topFiveClasses[section].class_name].toUpperCase()}
                      </h2>
                      <p className="text-sm text-warmscale-2 dark:text-lightscale-5 ">
                        {(Number(profileData?.topFiveClasses[section].time_played) /60 /60).toFixed(1)}{" "}hrs
                      </p>
                      <p className="text-sm max-md:hidden text-warmscale-2 dark:text-lightscale-5">
                        {profileData?.topFiveClasses[section].matches_played} matches
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
                          <span className="font-bold">{formatNumber(profileData?.topFiveClasses[section].kills)}</span>
                          <span className="md:hidden mx-1">/</span>
                        </div>
                      </div>

                      {/* Deaths */}
                      <div className="flex justify-center items-center md:flex-col">
                        <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">DEATHS</div>
                        <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                          <span className="font-bold">{formatNumber(profileData?.topFiveClasses[section].deaths)}</span>
                          <span className="md:hidden mx-1">/</span>
                        </div>
                      </div>

                      {/* Assists */}
                      <div className="flex justify-center items-center md:flex-col">
                        <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">ASSISTS</div>
                        <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                          <span className="font-bold">{formatNumber(profileData?.topFiveClasses[section].assists)}</span>
                        </div>
                      </div>
                    </div>

                    {/* WL Section */}
                    <div className="w-full flex flex-col justify-center items-center md:mt-1.5">
                      <div className="flex justify-center items-center md:gap-4">
                        {/* Wins */}
                        <div className="flex justify-center items-center md:flex-col ">
                          <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">W/L:</div>
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">WINS</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.topFiveClasses[section].wins)}</span>
                            <span className="md:hidden mx-1">/</span>
                          </div>
                        </div>
                        {/* Losses */}
                        <div className="flex justify-center items-center md:flex-col">
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">LOSSES</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.topFiveClasses[section].losses)}</span>
                          </div>
                        </div>
                      </div>
                      {/* WL BAR */}
                      <div className="relative h-1.5 w-full flex px-2">
                        <div
                          className="bg-green-600 opacity-80 h-full rounded-l-full"
                          style={{
                            width: `${(profileData?.topFiveClasses[section].wins / 
                              (profileData?.topFiveClasses[section].wins + profileData?.topFiveClasses[section].losses)) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-red-600 opacity-80 h-full rounded-r-full"
                          style={{
                            width: `${(profileData?.topFiveClasses[section].losses / 
                              (profileData?.topFiveClasses[section].wins + profileData?.topFiveClasses[section].losses)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="w-full flex justify-center items-center">
                      {/* Damage / Heals */}
                      <div className="flex justify-center items-center md:flex-col ">
                          <div className="mr-2 md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1.3vw] max-md:text-sm max-xl:text-[2.8vw]">{profileData?.topFiveClasses[section].class_name ==="medic" ? "HEALS" : "DAMAGE"}:</div>
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">{profileData?.topFiveClasses[section].class_name ==="medic" ? "HEALS" : "DAMAGE"}</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{profileData?.topFiveClasses[section].class_name ==="medic"? Number(profileData?.topFiveClasses[section].healing).toLocaleString(): Number(profileData?.topFiveClasses[section].damage).toLocaleString()}</span>
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
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-5/6 max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
          {/* Section Header */}
          <div className="w-full h-fit flex items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold">
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
            <div className="text-4xl mx-2">Most Played Maps</div>
            <div className="h-[2px] flex-grow bg-warmscale-5 dark:bg-lightscale-3 rounded-sm"></div>
          </div>

          {/* Cards */}
          <div className="w-full h-full overflow-hidden grid grid-rows-5 p-2 xl:gap-3 max-xl:gap-2">
            {[0, 1, 2, 3, 4].map((section) => (
              <div key={section} className="relative md:p-3 max-md:px-2 flex w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                <div className="absolute bottom-0 left-2 text-warmscale-5 dark:text-lightscale-3 opacity-50 ">{section+1}.</div>
                <div className="h-full w-fit flex items-center mr-2">
                  <img
                    src={`/maps/${profileData?.topFiveMaps[section].map_name}.png`}
                    className=" xl:h-[7vh] lg:h-[10.5vh] max-lg:h-[10vh] object-cover rounded-tl-xl rounded-br-xl"
                    alt={`${profileData?.topFiveMaps[0]?.map_name} image`}
                  />
                </div>
                <div className="grid grid-cols-4 w-full h-full gap-2">
                  {/* Map Title */}
                  <div className="w-full h-full">
                    <div className="h-full text-left flex flex-col justify-center items-start">
                      <h2 className="md:text-3xl sm:text-2xl max-sm:text-lg font-semibold text-warmscale-5 dark:text-lightscale-3 -my-1">
                        {profileData?.topFiveMaps[section].map_name.toUpperCase()}
                      </h2>
                      <p className="text-sm text-warmscale-2 dark:text-lightscale-5 ">
                        {(Number(profileData?.topFiveMaps[section].time_played) /60 /60).toFixed(1)}{" "}hrs
                      </p>
                      <p className="text-sm max-md:hidden text-warmscale-2 dark:text-lightscale-5">
                        {profileData?.topFiveMaps[section].matches_played} matches
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
                            <span className="font-bold">{formatNumber(profileData?.topFiveMaps[section].wins)}</span>
                            <span className="md:hidden mx-1">/</span>
                          </div>
                        </div>
                        {/* Losses */}
                        <div className="flex justify-center items-center md:flex-col">
                          <div className="max-md:hidden text-warmscale-2 dark:text-lightscale-5 xl:text-[1vw] max-xl:text-[2vw]">LOSSES</div>
                          <div className="flex items-center text-warmscale-5 dark:text-lightscale-3 xl:text-[1.3vw] max-xl:text-[2.8vw] max-md:text-sm md:-mt-[0.5vw]">
                            <span className="font-bold">{formatNumber(profileData?.topFiveMaps[section].losses)}</span>
                          </div>
                        </div>
                      </div>
                      {/* WL BAR */}
                      <div className="relative h-1.5 w-full flex px-2">
                        <div
                          className="bg-green-600 opacity-80 h-full rounded-l-full"
                          style={{
                            width: `${(profileData?.topFiveMaps[section].wins / 
                              (profileData?.topFiveMaps[section].wins + profileData?.topFiveMaps[section].losses)) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-red-600 opacity-80 h-full rounded-r-full"
                          style={{
                            width: `${(profileData?.topFiveMaps[section].losses / 
                              (profileData?.topFiveMaps[section].wins + profileData?.topFiveMaps[section].losses)) * 100}%`,
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
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-5/6 max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
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
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-5/6 max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
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
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-5/6 max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-1/2 xl:h-4/6 font-londrina">
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
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-5/6 max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-2/3 xl:h-4/6 font-londrina">
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

      {/* Best Teammates & Enemies New Style */}
      <div className="flex flex-col h-screen w-full snap-start items-center justify-center bg-topo-light bg-cover bg-center dark:bg-topo-dark bg-lightscale-3 dark:bg-warmscale-7 md:p-8 max-md:p-3">
        <div className="max-xl:h-5/6 max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-2/3 xl:h-4/6 font-londrina">
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
        <div className="max-xl:h-5/6 max-h-full flex flex-col justify-center items-center max-md:mt-5 max-xl:w-full xl:w-2/3 xl:h-4/6 ">
          <div className="w-full h-full md:h-1/2 md:w-1/2 flex flex-col justify-center items-center p-2">
            <div className="w-full h-fit flex justify-center items-baseline text-warmscale-5 dark:text-lightscale-3 font-extrabold gap-4">
              <div className="text-4xl mx-2">Download & Share</div></div>
              <div className="flex flex-col items-center justify-center h-1/3">
              {/* Recap Card */}
              <div
                ref={profileCardRef}
                className="h-full w-full"
              ></div>

              {/* Download Button */}
              {imageDataUrl && (
                <div className="mt-4">
                  <a
                    href={imageDataUrl}
                    download="profile-recap.png"
                    className="px-4  py-2 bg-purple-500 text-white rounded"
                  >
                    Download Image
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Recap;
