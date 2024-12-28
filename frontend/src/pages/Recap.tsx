import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Recap: React.FC = () => {
  const { id64 } = useParams<{ id64: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${id64}`);
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

  const classMainCount: Record<string, number> = {
    scout: 5477,
    soldier: 5395,
    pyro: 1197,
    demoman: 2149,
    heavyweapons: 933,
    engineer: 916,
    medic: 3239,
    sniper: 778,
    spy: 833,
  };

  const downloadProfileCard = async () => {
    try {
      const response = await fetch(`/api/profile-card/${id64}`);
      if (!response.ok) throw new Error("Failed to download the profile card");
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      // Create a link element to download the image
      const link = document.createElement("a");
      link.href = url;
      link.download = "profile-card.png";
      link.click();
  
      // Revoke the object URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading profile card:", error);
    }
  };

  useEffect(() => {
    if (id64) {
      fetchProfileData();
    }
  }, [id64]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toLocaleString(); // Use locale string for smaller numbers
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-sm"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen snap-y snap-mandatory overflow-y-scroll">
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
                  <div className="text-center text-warmscale-6 dark:text-lightscale-2 text-lg">{id64 && profileData?.steamInfo[id64]?.name}</div>
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
                <div className="xl:text-[4.2vw] max-xl:text-[9.4vw] max-md:text-[8vw] xl:-mb-[2.3vw] max-xl:-my-[4.8vw] max-md:w-full max-md:text-right text-lightscale-9 dark:text-tf-orange-dark">{profileData?.general[0].matches_played ? formatNumber(profileData.general[0].matches_played) : "0"}</div>
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
            <div className="w-full h-full bg-lightscale-3/30 dark:bg-warmscale-7/30 backdrop-blur-sm border-2 border-lightscale-5 dark:border-warmscale-6 shadow rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg"></div>
            
          </div>
        </div>
      </div>

      {/* Global Info */}
      <div className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-300 md:p-8 max-md:p-3 relative">
        {/* Character/Image */}
        <div className=" text-center mb-4 md:hidden">
        <h1 className=" text-3xl font-semibold mb-2">Hey{" "}
              {id64 && profileData?.steamInfo[id64]?.name}!
            </h1>
            <p>Welcome to 2024 wrapped! This is the first year of your Team Fortress 2 game play recap, so let start with some global stats!</p>
          <div className="w-32 h-max rounded-lg flex items-center justify-center mb-2">
          </div>
        </div>
        <div className="flex max-md:flex-col md:gap-4 max-md:gap-2 justify-center items-center md:w-4/6 max-md:w-full">
          <div className="grid grid-cols-1 md:gap-4 max-md:gap-2 max-w-4xl max-md:w-full md:w-full text-center">
            <div className="stats shadow rounded-md">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">Total Unique Players</div>
                <div className="stat-value max-md:text-base my-1">20,960</div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">For 15 year old game that is not too bad at all!</div>
              </div>
            </div>

            <div className="stats shadow rounded-md ">
              <div className="stat max-md:p-3 my-1">
                <div className="stat-title max-md:text-xs">Matches Played</div>
                <div className="stat-value max-md:text-base my-1">218,947</div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">That is 600 matches everyday!</div>
              </div>
            </div>

            <div className="stats shadow rounded-md">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">Total Playtime</div>
                <div className="stat-value max-md:text-base my-1">909,969 <span>hrs</span></div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">That is 104 years of playtime!</div>
              </div>
            </div>
          </div>
          <div className=" text-center max-md:hidden mx-6">
            <h1 className=" text-3xl font-semibold mb-2">Hey{" "}
              {id64 && profileData?.steamInfo[id64]?.name}!
            </h1>
            <p>Welcome to 2024 wrapped! This is the first year of your Team Fortress 2 game play recap, so let start with some global stats!</p>
            <div className="w-[26rem] h-max rounded-lg flex items-center justify-center mb-2">
              <img
                src="/earth.png"
                alt="Character"
                className="h-full w-auto object-contain rounded-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:gap-4 max-md:gap-2 max-w-4xl max-md:w-full md:w-full text-center">
            <div className="stats shadow rounded-md">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">Total Kills</div>
                <div className="stat-value max-md:text-base my-1">36,225,975</div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">Now thats a lot of damage!</div>
              </div>
            </div>
            <div className="stats shadow rounded-md">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">Self Eliminations</div>
                <div className="stat-value max-md:text-base my-1">421,026</div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">That is way too many kill-binds!</div>
              </div>
            </div>
            <div className="stats shadow rounded-md">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">Heals Given</div>
                <div className="stat-value max-md:text-base my-1">19.1 Billion</div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">What would we do without our medics?!</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* General Info Section */}
      <div className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-200 md:p-8 max-md:p-3 relative">
        {/* Character/Image */}
        <div className=" text-center mb-4 lg:hidden">
          <div className="w-32 h-max rounded-lg flex items-center justify-center mb-2">
            <img
              src={`https://avatars.fastly.steamstatic.com/${
                id64 && profileData?.steamInfo[id64]?.avatar
              }_full.jpg`}
              alt="Character"
              className="h-full w-auto object-contain rounded-full"
            />
          </div>
          <h1 className=" text-2xl font-semibold">
            {id64 && profileData?.steamInfo[id64]?.name}
          </h1>
        </div>
        <div className="flex max-md:flex-col md:gap-4 max-md:gap-2 justify-center items-center md:w-4/6 max-md:w-full">
          <div className="grid grid-cols-1 md:gap-4 max-md:gap-2 max-w-4xl max-md:w-full md:w-full text-center">
            <div className="stats shadow-lg rounded-md border border-neutral ">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">
                  Most played class
                </div>
                <div className="stat-value max-md:text-base">
                  {classes[profileData?.topFiveClasses[0].class_name]}
                </div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  Just like {classMainCount[profileData?.topFiveClasses[0].class_name]} others
                </div>
              </div>
            </div>

            <div className="stats shadow-lg rounded-md border border-neutral ">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">Matches Played</div>
                <div className="stat-value max-md:text-base">
                  {profileData?.general[0].matches_played}
                </div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  Top 7% players
                </div>
              </div>
            </div>

            <div className="stats shadow-lg rounded-md border border-neutral ">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">Matches Won</div>
                <div className="stat-value max-md:text-base">
                  {profileData?.general[0].matches_won}
                </div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  Your winrate was{" "}
                  <strong>
                    {(
                      (profileData?.general[0].matches_won /
                        profileData?.general[0].matches_played) *
                      100
                    ).toFixed(1)}
                    %
                  </strong>
                  !
                </div>
              </div>
            </div>
          </div>
          <div className=" text-center max-lg:hidden">
            <div className="w-64 h-max rounded-lg flex items-center justify-center mb-2 ">
              <img
                src={`https://avatars.fastly.steamstatic.com/${
                  id64 && profileData?.steamInfo[id64]?.avatar
                }_full.jpg`}
                alt="Character"
                className="h-full w-auto object-contain rounded-full"
              />
            </div>
            <h1 className=" text-3xl font-semibold">
              {id64 && profileData?.steamInfo[id64]?.name}
            </h1>
          </div>
          <div className="grid grid-cols-1 md:gap-4 max-md:gap-2 max-w-4xl max-md:w-full md:w-full text-center ">
            <div className="stats shadow-lg rounded-md border border-neutral ">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">KDA</div>
                <div className="stat-value max-md:text-base">
                  {(
                    (profileData?.general[0].kills +
                      profileData?.general[0].assists) /
                    profileData?.general[0].deaths
                  ).toFixed(2)}
                </div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  Better than 1% of players
                </div>
              </div>
            </div>

            <div className="stats rounded-md shadow-lg border border-neutral ">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">
                  {profileData?.topFiveClasses[0].class_name === "medic"
                    ? "Heals Given"
                    : "Damage Dealt"}
                </div>
                <div className="stat-value max-md:text-base">
                  {profileData?.topFiveClasses[0].class_name === "medic"
                    ? Number(profileData?.general[0].heals).toLocaleString()
                    : Number(profileData?.general[0].damage).toLocaleString()}
                </div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  More than 84% of players
                </div>
              </div>
            </div>

            <div className="stats shadow-lg rounded-md border border-neutral ">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">Minutes Played</div>
                <div className="stat-value max-md:text-base">
                  {Math.round(
                    Number(profileData?.general[0].time_played) / 60
                  ).toLocaleString()}
                </div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  That is{" "}
                  {(
                    Number(profileData?.general[0].time_played) /
                    60 /
                    60
                  ).toFixed(1)}{" "}
                  hours!{" "}
                  {Number(profileData?.general[0].time_played) / 60 / 60 > 100
                    ? "Wow!"
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Most Played Classes */}
      <div className="h-screen w-full snap-start flex items-center justify-center bg-base-300">
        <div className="text-center w-full">
          <h2 className="text-2xl font-bold mb-4">Your Most Played Classes</h2>
          <section className="w-full">
            <div className="flex flex-col items-center w-full md:px-4 max-md:px-2">
              <div className="flex items-center justify-center w-full 2xl:w-1/2" >
                <div className=" text-xl font-bold md:mr-5 max-md:hidden">1.</div>
                <div className="w-full md:h-48 max-md:h-36 bg-base-100 rounded-lg border border-neutral shadow-lg flex items-center justify-center mb-4 relative">
                <div className="absolute right-2 top-2 text-xs md:hidden">1</div>
                  <div className="w-full h-full bg-base-100 rounded-lg shadow-lg flex items-center p-2">
                    
                    <img src={`/portraits/${profileData?.topFiveClasses[0].class_name}.png`} className="h-full w-[72px] object-cover object-top rounded-l" alt={`${profileData?.topFiveClasses[0]?.class_name} image`}
                    />
                    <div className="m-3 h-full text-left justify-center items-center w-1/5">
                      <h2 className="md:text-3xl max-md:text-lg font-semibold">
                        {classes[profileData?.topFiveClasses[0].class_name]}
                      </h2>
                      <p className="text-sm">
                        {(Number(profileData?.topFiveClasses[0].time_played) /60 /60).toFixed(1)}{" "}hrs
                      </p>
                      <p className="text-sm max-sm:hidden">
                        {profileData?.topFiveClasses[0].matches_played} matches
                      </p>
                    </div>
                    <div className="grid md:grid-flow-col md:grid-cols-3 max-md:grid-flow-row max-md:grid-rows-3 w-full gap-2">
                      <div className="max-md:flex max-md:justify-center max-md:items-center">
                        <div className="md:text-xl max-md:text-sm md:w-full max-md:mr-2 font-bold">
                          KDA{" "}
                          <span className="md:hidden">:</span>
                          <span className="text-xs max-md:hidden">{` (${(
                            (profileData?.topFiveClasses[0]?.kills +
                              profileData?.topFiveClasses[0]?.assists) /
                            profileData?.topFiveClasses[0]?.deaths
                          ).toFixed(2)})`}</span>
                        </div>
                        <div className="md:text-xl max-md:text-sm font-bold">
                          {profileData?.topFiveClasses[0].kills} /{" "}
                          {profileData?.topFiveClasses[0].deaths} /{" "}
                          {profileData?.topFiveClasses[0].assists}
                        </div>
                      </div>
                      <div className="text-center py-2 md:border-x max-md:border-y border-neutral max-md:flex max-md:justify-center max-md:items-center">
                        <div className="md:text-xl max-md:text-sm md:w-full max-md:mr-2 font-bold flex justify-center items-center md:-mb-2 ">
                          <div className="max-md:w-1/2 text-right md:hidden max-md:mr-2">W/L:</div>
                          <div className="max-md:w-1/2 text-right max-md:hidden">WON</div>
                          <div className="mx-2 md:text-2xl max-md:text-sm max-md:hidden">-</div>
                          <div className="max-md:w-1/2 text-left max-md:hidden">LOST</div>
                        </div>
                        <div className="md:text-2xl max-md:text-sm font-bold flex justify-center items-center">
                          <div className="w-1/2 text-right">{profileData?.topFiveClasses[0].wins}</div>
                          <div className="mx-2 md:text-2xl max-md:text-sm max-md:hidden">-</div>
                          <div className="md:mx-2 text-sm md:hidden">/</div>
                          <div className="md:w-1/2 text-left">{profileData?.topFiveClasses[0].losses}</div>
                        </div>
                      </div>
                      <div className="text-center max-md:flex max-md:justify-center max-md:items-center">
                        <div className="md:text-xl max-md:text-sm font-bold flex justify-center items-center md:-mb-1 ">
                          <div className="md:w-1/2 text-md max-md:mr-2">{profileData?.topFiveClasses[0].class_name ==="medic" ? "HEALS" : "DAMAGE"}<span className="md:hidden">:</span></div>
                        </div>
                        <div className="md:text-2xl max-md:text-sm font-bold flex justify-center items-center">
                          <div className="md:w-1/2">{profileData?.topFiveClasses[0].class_name ==="medic"  ? Number(profileData?.topFiveClasses[0].healing).toLocaleString(): Number(profileData?.topFiveClasses[0].damage).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                </div>
              </div>

              {/* Other Sections */}
              {[1, 2, 3, 4].map((section, index) => (
                <div key={index} className="flex items-center w-full 2xl:w-1/2">
                  <div className="text-xl font-bold mr-5 max-md:hidden">{section + 1}.</div>
                  <div className="w-full h-24 bg-base-200 rounded-lg shadow-lg flex items-center mb-4 p-2  border border-neutral  relative">
                    <div className="absolute right-2 top-2 text-xs md:hidden">{section + 1}</div>
                    <img src={`/portraits/${profileData?.topFiveClasses[section].class_name}.png`} className="w-24 h-20 object-cover object-top rounded-l" alt={`${profileData?.topFiveClasses[section]?.class_name} image`}/>
                    <div className="m-3 h-full text-left justify-center items-center w-1/5">
                      <h2 className="md:text-3xl max-md:text-lg font-semibold">{classes[profileData?.topFiveClasses[section].class_name]}</h2>
                      <p className="text-sm">{(Number(profileData?.topFiveClasses[section].time_played)/60/60).toFixed(1)}{" "}hrs</p>
                      <p className="text-sm max-sm:hidden">{profileData?.topFiveClasses[section].matches_played}{" "}matches</p>
                    </div>
                    <div className=" grid md:grid-flow-col md:grid-cols-3 max-md:grid-flow-row max-md:grid-rows-3 w-full md:gap-2">
                      <div className="max-md:flex max-md:justify-center max-md:items-center">
                        <div className="md:text-xl max-md:text-sm font-bold md:-mb-1">KDA{" "}
                          <span className="md:hidden mr-2">:</span>
                          <span className="text-xs text-opacity-10 max-md:hidden">{`(${((profileData?.topFiveClasses[section]?.kills +profileData?.topFiveClasses[section]?.assists) /profileData?.topFiveClasses[section]?.deaths).toFixed(2)})`}</span>
                        </div>
                        <div className="md:text-2l max-md:text-sm font-bold">{profileData?.topFiveClasses[section].kills} /{" "}{profileData?.topFiveClasses[section].deaths} /{" "}{profileData?.topFiveClasses[section].assists}
                        </div>
                      </div>
                      <div className="text-center max-md:h-fit max-md:py-1 md:border-x max-md:border-y border-neutral max-md:flex max-md:justify-center max-md:items-center">
                        <div className="md:text-xl max-md:text-sm font-bold flex justify-center items-center md:-mb-2">
                          <div className="max-md:w-1/2 text-right md:hidden max-md:mr-2">W/L:</div>
                          <div className="w-1/2 text-right max-md:hidden">WON</div>
                          <div className="md:mx-2 text-2xl max-md:hidden">-</div>
                          <div className="w-1/2 text-left max-md:hidden">LOST</div>
                        </div>
                        <div className="md:text-xl max-md:text-sm font-bold flex justify-center items-center">
                          <div className="w-1/2 text-right">
                            {profileData?.topFiveClasses[section].wins}
                          </div>
                          <div className="md:mx-2 md:text-2xl max-md:text-sm max-md:hidden">-</div>
                          <span className="md:hidden">/</span>
                          <div className="w-1/2 text-left">
                            {profileData?.topFiveClasses[section].losses}
                          </div>
                        </div>
                      </div>
                      <div className="text-center max-md:flex max-md:justify-center max-md:items-center">
                        <div className="md:text-lg max-md:text-sm font-bold flex justify-center items-center md:-mb-1">
                          <div className="md:w-1/2 text-md">
                            {profileData?.topFiveClasses[section].class_name ==="medic" ? "HEALS"  : "DAMAGE"}
                            <span className="md:hidden mr-2">:</span>
                          </div>
                        </div>
                        <div className="md:text-2xl max-md:text-sm font-bold flex justify-center items-center">
                          <div className="md:w-1/2">
                            {profileData?.topFiveClasses[section].class_name ===
                            "medic"
                              ? Number(
                                  profileData?.topFiveClasses[section].healing
                                ).toLocaleString()
                              : Number(
                                  profileData?.topFiveClasses[section].damage
                                ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Most Played Maps */}
      <div className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-200">
        <div className="flex justify-center items-center w-full 2xl:w-1/2">
          <div className="text-center text-xl font-bold">MOST PLAYED MAPS</div>
        </div>
        {[0, 1, 2, 3, 4].map((section, index) => (
          <div key={index} className="flex items-center w-full 2xl:w-1/2">
            <div className="w-full rounded-lg flex items-center m-2 relative">
              <div className="flex w-full h-24 bg-base-100 rounded-lg shadow-lg border border-neutral max-md:p-2">
                <div className="absolute right-2 top-2 text-xs md:hidden">{section + 1}</div>
                <img src={`/maps/${profileData?.topFiveMaps[section].map_name}.png`} className="md:w-24 md:m-2 md:h-20 max-md:h-22 max-md:w-12 object-cover object-top rounded-l" alt={`${profileData?.topFiveMaps[section].map_name} image`}/>
                <div className="mx-2 p-1 h-full text-left justify-center items-center md:w-1/5 max-md:w-2/5 border-r border-neutral">
                  <h2 className="md:text-2xl max-md:text-xs font-bold md:max-w-28 max-md:max-w-20 truncate overflow-hidden">
                    {profileData?.topFiveMaps[section].map_name.charAt(0).toUpperCase() + profileData?.topFiveMaps[section].map_name.slice(1).toLowerCase()}
                  </h2>
                  <p className="md:text-sm max-md:text-xs">
                  {profileData?.topFiveMaps[section].matches_played} matches
                  </p>
                  <p className="md:text-sm max-md:text-xs">
                  {((profileData?.topFiveMaps[section].wins / profileData?.topFiveMaps[section].matches_played) * 100).toFixed(0)}% winrate                  </p>
                </div>
                <div className="w-full pr-3 h-full">
                <div className="flex justify-center items-center">
                    <div className="grid grid-cols-2 text-center md:text-lg max-md:text-sm font-bold items-center w-full h-full gap-4 mt-3 mb-1">
                      <div>
                        <div className="">WINS</div>
                        <div className="">{profileData?.topFiveMaps[section]?.wins}</div>
                      </div>
                      <div>
                        <div className="">LOSSES</div>
                        <div className="">{profileData?.topFiveMaps[section]?.losses}</div>
                      </div>  
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-lg relative mb-1">
                  {/* Green Success Bar */}
                    <div
                      className="bg-success h-2 absolute rounded-l-lg bg-opacity-60 border-r-2 border-base-300"
                      style={{
                        width: `${((profileData?.topFiveMaps[section]?.wins / profileData?.topFiveMaps[section]?.matches_played) * 100) || 0}%`,
                      }}
                    ></div>

                    {/* Red Error Bar */}
                    <div
                      className="bg-error h-2 absolute rounded-r-lg bg-opacity-60"
                      style={{
                        left: `${((profileData?.topFiveMaps[section]?.wins / profileData?.topFiveMaps[section]?.matches_played) * 100) || 0}%`,
                        width: `${100 - ((profileData?.topFiveMaps[section]?.wins / profileData?.topFiveMaps[section]?.matches_played) * 100) || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Teammates */}
      <div className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-300">
        <div className="flex justify-center items-center w-full 2xl:w-1/2">
          <div className="text-center text-xl font-bold">MOST PLAYED TEAMMATES</div>
        </div>
        {[0, 1, 2, 3, 4].map((section, index) => (
          <div key={index} className="flex items-center w-full 2xl:w-1/2">
            <div className="w-full rounded-lg flex items-center m-2 relative">
              <div className="flex w-full h-24 bg-base-100 rounded-lg shadow-lg border border-neutral max-md:p-2">
                <div className="absolute right-2 top-2 text-xs md:hidden">{section + 1}</div>
                <img src={`https://avatars.fastly.steamstatic.com/${profileData?.teammates[section].teammate_id64 && profileData?.steamInfo[profileData?.teammates[section].teammate_id64]?.avatar}_full.jpg`} className="md:w-24 md:m-2 md:h-20 max-md:h-22 max-md:w-12 object-cover object-top rounded-l" alt={`${profileData?.steamInfo[profileData?.teammates[section].teammate_id64]?.name} image`}/>
                <div className="mx-2 p-1 h-full text-left justify-center items-center md:w-1/5 max-md:w-2/5 border-r border-neutral">
                  <h2 className="md:text-2xl max-md:text-xs font-bold md:max-w-28 max-md:max-w-20 truncate overflow-hidden">
                    {profileData?.steamInfo[profileData?.teammates[section].teammate_id64]?.name}
                  </h2>
                  <p className="md:text-sm max-md:text-xs">
                    {profileData?.teammates[section].matches_played} matches
                  </p>
                  <p className="md:text-sm max-md:text-xs">
                    {((profileData?.teammates[section].wins / profileData?.teammates[section].matches_played) * 100).toFixed(0)}% winrate
                  </p>
                </div>
                <div className="w-full pr-3 h-full">
                <div className="flex justify-center items-center">
                    <div className="grid grid-cols-2 text-center md:text-lg max-md:text-sm font-bold items-center w-full h-full gap-4 mt-3 mb-1">
                      <div>
                        <div className="">WINS</div>
                        <div className="">{profileData?.enemies[section]?.wins}</div>
                      </div>
                      <div>
                        <div className="">LOSSES</div>
                        <div className="">{profileData?.enemies[section]?.losses}</div>
                      </div>  
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-lg relative mb-1">
                  {/* Green Success Bar */}
                    <div
                      className="bg-success h-2 absolute rounded-l-lg bg-opacity-60 border-r-2 border-base-300"
                      style={{
                        width: `${((profileData?.teammates[section]?.wins / profileData?.teammates[section]?.matches_played) * 100) || 0}%`,
                      }}
                    ></div>

                    {/* Red Error Bar */}
                    <div
                      className="bg-error h-2 absolute rounded-r-lg bg-opacity-60"
                      style={{
                        left: `${((profileData?.teammates[section]?.wins / profileData?.teammates[section]?.matches_played) * 100) || 0}%`,
                        width: `${100 - ((profileData?.teammates[section]?.wins / profileData?.teammates[section]?.matches_played) * 100) || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enemies */}
      <div className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-200">
        <div className="flex justify-center items-center w-full 2xl:w-1/2">
          <div className="text-center text-xl font-bold">MOST PLAYED ENEMIES</div>
        </div>
        {[0, 1, 2, 3, 4].map((section, index) => (
          <div key={index} className="flex items-center w-full 2xl:w-1/2">
            <div className="w-full rounded-lg flex items-center m-2 relative">
              <div className="flex w-full h-24 bg-base-100 rounded-lg shadow-lg border border-neutral max-md:p-2">
                <div className="absolute right-2 top-2 text-xs md:hidden">{section + 1}</div>
                <img src={`https://avatars.fastly.steamstatic.com/${profileData?.enemies[section].enemy_id64 && profileData?.steamInfo[profileData?.enemies[section].enemy_id64]?.avatar}_full.jpg`} className="md:w-24 md:m-2 md:h-20 max-md:h-22 max-md:w-12 object-cover object-top rounded-l" alt={`${profileData?.steamInfo[profileData?.teammates[section].teammate_id64]?.name} image`}/>
                <div className="mx-2 p-1 h-full text-left justify-center items-center md:w-1/5 max-md:w-2/5 border-r border-neutral">
                  <h2 className="md:text-2xl max-md:text-xs font-bold md:max-w-28 max-md:max-w-20 truncate overflow-hidden">
                    {profileData?.steamInfo[profileData?.enemies[section].enemy_id64]?.name}
                  </h2>
                  <p className="md:text-sm max-md:text-xs">
                    {profileData?.enemies[section].matches_played} matches
                  </p>
                  <p className="md:text-sm max-md:text-xs">
                    {((profileData?.enemies[section].wins / profileData?.enemies[section].matches_played) * 100).toFixed(0)}% winrate
                  </p>
                </div>
                <div className="w-full pr-3 h-full">
                  <div className="flex justify-center items-center">
                    <div className="grid grid-cols-2 text-center md:text-lg max-md:text-sm font-bold items-center w-full h-full gap-4 mt-3 mb-1">
                      <div>
                        <div className="">WINS</div>
                        <div className="">{profileData?.enemies[section]?.wins}</div>
                      </div>
                      <div>
                        <div className="">LOSSES</div>
                        <div className="">{profileData?.enemies[section]?.losses}</div>
                      </div>  
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-lg relative mb-1">
                  {/* Green Success Bar */}
                    <div
                      className="bg-success h-2 absolute rounded-l-lg bg-opacity-60 border-r-2 border-base-300"
                      style={{
                        width: `${((profileData?.enemies[section]?.wins / profileData?.enemies[section]?.matches_played) * 100) || 0}%`,
                      }}
                    ></div>

                    {/* Red Error Bar */}
                    <div
                      className="bg-error h-2 absolute rounded-r-lg bg-opacity-60"
                      style={{
                        left: `${((profileData?.enemies[section]?.wins / profileData?.enemies[section]?.matches_played) * 100) || 0}%`,
                        width: `${100 - ((profileData?.enemies[section]?.wins / profileData?.enemies[section]?.matches_played) * 100) || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Best Teammates & Enemies */}
      <div className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-300">
        <div className="w-full h-full flex max-md:flex-col justify-center items-center 2xl:w-2/3">
          <div className="w-full">
          <div className="flex justify-center items-center w-full">
            <div className="text-center text-xl font-bold">BEST WINRATE WITH</div>
          </div>
          {[0, 1, 2].map((section, index) => (
          <div key={index} className="flex items-center w-full">
            <div className="w-full rounded-lg flex items-center m-2 relative">
              <div className="flex w-full h-24 bg-base-200 rounded-lg shadow-lg border border-success max-md:p-2">
                <div className="absolute right-2 top-2 text-xs md:hidden">{section + 1}</div>
                <img src={`https://avatars.fastly.steamstatic.com/${profileData?.winningTeammates[section].teammate_id64 && profileData?.steamInfo[profileData?.winningTeammates[section].teammate_id64]?.avatar}_full.jpg`} className="md:w-24 md:m-2 md:h-20 max-md:h-22 max-md:w-12 object-cover object-top rounded-l" alt={`${profileData?.steamInfo[profileData?.winningTeammates[section].teammate_id64]?.name} image`}/>
                <div className="mx-2 p-1 h-full text-left justify-center items-center md:w-2/6 max-md:w-2/5 border-r border-neutral">
                  <h2 className="md:text-2xl max-md:text-xs font-bold md:max-w-28 max-md:max-w-20 truncate overflow-hidden">
                    {profileData?.steamInfo[profileData?.winningTeammates[section].teammate_id64]?.name}
                  </h2>
                  <p className="md:text-sm max-md:text-xs">
                    {profileData?.winningTeammates[section].matches_won + profileData?.winningTeammates[section]?.matches_lost} matches
                  </p>
                  <p className="md:text-sm max-md:text-xs">
                    {((profileData?.winningTeammates[section].matches_won / (profileData?.winningTeammates[section].matches_won + profileData?.winningTeammates[section]?.matches_lost)) * 100).toFixed(0)}% winrate
                  </p>
                </div>
                <div className="w-full pr-3 h-full">
                  <div className="flex justify-center items-center">
                    <div className="grid grid-cols-2 text-center md:text-lg max-md:text-sm font-bold items-center w-full h-full gap-4 mt-3 mb-1">
                      <div>
                        <div className="">WINS</div>
                        <div className="">{profileData?.winningTeammates[section]?.matches_won}</div>
                      </div>
                      <div>
                        <div className="">LOSSES</div>
                        <div className="">{profileData?.winningTeammates[section]?.matches_lost}</div>
                      </div>  
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-lg relative mb-1">
                  {/* Green Success Bar */}
                    <div
                      className="bg-success h-2 absolute rounded-l-lg bg-opacity-60 border-r-2 border-base-300"
                      style={{
                        width: `${((profileData?.winningTeammates[section]?.matches_won / (profileData?.winningTeammates[section]?.matches_won + profileData?.winningTeammates[section]?.matches_lost)) * 100) || 0}%`,
                      }}
                    ></div>

                    {/* Red Error Bar */}
                    <div
                      className="bg-error h-2 absolute rounded-r-lg bg-opacity-60"
                      style={{
                        left: `${((profileData?.winningTeammates[section]?.matches_won / (profileData?.winningTeammates[section]?.matches_won + profileData?.winningTeammates[section]?.matches_lost)) * 100) || 0}%`,
                        width: `${100 - ((profileData?.winningTeammates[section]?.matches_won / (profileData?.winningTeammates[section]?.matches_won + profileData?.winningTeammates[section]?.matches_lost)) * 100) || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))}
          </div>
          <div className="w-full">
          <div className="flex justify-center items-center w-full max-md:mt-3">
            <div className="text-center text-xl font-bold">BEST WINRATE AGAINST</div>
          </div>
          {[0, 1, 2].map((section, index) => (
            <div key={index} className="flex items-center w-full">
              <div className="w-full rounded-lg flex items-center m-2 relative">
                <div className="flex w-full h-24 bg-base-100 rounded-lg shadow-lg border border-success max-md:p-2">
                  <div className="absolute right-2 top-2 text-xs md:hidden">{section + 1}</div>
                  <img src={`https://avatars.fastly.steamstatic.com/${profileData?.winningEnemies[section].enemy_id64 && profileData?.steamInfo[profileData?.winningEnemies[section].enemy_id64]?.avatar}_full.jpg`} className="md:w-24 md:m-2 md:h-20 max-md:h-22 max-md:w-12 object-cover object-top rounded-l" alt={`${profileData?.steamInfo[profileData?.winningEnemies[section].enemy_id64]?.name} image`}/>
                  <div className="mx-2 p-1 h-full text-left justify-center items-center md:w-2/6 max-md:w-2/5 border-r border-neutral">
                    <h2 className="md:text-2xl max-md:text-xs font-bold md:max-w-28 max-md:max-w-20 truncate overflow-hidden">
                      {profileData?.steamInfo[profileData?.winningEnemies[section].enemy_id64]?.name}
                    </h2>
                    <p className="md:text-sm max-md:text-xs">
                      {profileData?.winningEnemies[section].matches_won + profileData?.winningEnemies[section]?.matches_lost} matches
                    </p>
                    <p className="md:text-sm max-md:text-xs">
                      {((profileData?.winningEnemies[section].matches_won / (profileData?.winningEnemies[section].matches_won + profileData?.winningEnemies[section]?.matches_lost)) * 100).toFixed(0)}% winrate
                    </p>
                  </div>
                  <div className="w-full pr-3 h-full">
                    <div className="flex justify-center items-center">
                      <div className="grid grid-cols-2 text-center md:text-lg max-md:text-sm font-bold items-center w-full h-full gap-4 mt-3 mb-1">
                        <div>
                          <div className="">WINS</div>
                          <div className="">{profileData?.winningEnemies[section]?.matches_won}</div>
                        </div>
                        <div>
                          <div className="">LOSSES</div>
                          <div className="">{profileData?.winningEnemies[section]?.matches_lost}</div>
                        </div>  
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-lg relative mb-1">
                    {/* Green Success Bar */}
                      <div
                        className="bg-success h-2 absolute rounded-l-lg bg-opacity-60 border-r-2 border-base-300"
                        style={{
                          width: `${((profileData?.winningEnemies[section]?.matches_won / (profileData?.winningEnemies[section]?.matches_won + profileData?.winningEnemies[section]?.matches_lost)) * 100) || 0}%`,
                        }}
                      ></div>

                      {/* Red Error Bar */}
                      <div
                        className="bg-error h-2 absolute rounded-r-lg bg-opacity-60"
                        style={{
                          left: `${((profileData?.winningEnemies[section]?.matches_won / (profileData?.winningEnemies[section]?.matches_won + profileData?.winningEnemies[section]?.matches_lost)) * 100) || 0}%`,
                          width: `${100 - ((profileData?.winningEnemies[section]?.matches_won / (profileData?.winningEnemies[section]?.matches_won + profileData?.winningEnemies[section]?.matches_lost)) * 100) || 0}%`,
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

      {/* Worst Teammates & Enemies */}
      <div className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-200">
        <div className="w-full h-full flex max-md:flex-col justify-center items-center 2xl:w-2/3">
          <div className="w-full">
          <div className="flex justify-center items-center w-full">
            <div className="text-center text-xl font-bold">WORST WINRATE WITH</div>
          </div>
          {[0, 1, 2].map((section, index) => (
          <div key={index} className="flex items-center w-full">
            <div className="w-full rounded-lg flex items-center m-2 relative">
              <div className="flex w-full h-24 bg-base-100 rounded-lg shadow-lg border border-error max-md:p-2">
                <div className="absolute right-2 top-2 text-xs md:hidden">{section + 1}</div>
                <img src={`https://avatars.fastly.steamstatic.com/${profileData?.losingTeammates[section].teammate_id64 && profileData?.steamInfo[profileData?.losingTeammates[section].teammate_id64]?.avatar}_full.jpg`} className="md:w-24 md:m-2 md:h-20 max-md:h-22 max-md:w-12 object-cover object-top rounded-l" alt={`${profileData?.steamInfo[profileData?.losingTeammates[section].teammate_id64]?.name} image`}/>
                <div className="mx-2 p-1 h-full text-left justify-center items-center md:w-2/6 max-md:w-2/5 border-r border-neutral">
                  <h2 className="md:text-2xl max-md:text-xs font-bold md:max-w-28 max-md:max-w-20 truncate overflow-hidden">
                    {profileData?.steamInfo[profileData?.losingTeammates[section].teammate_id64]?.name}
                  </h2>
                  <p className="md:text-sm max-md:text-xs">
                    {profileData?.losingTeammates[section].matches_won + profileData?.losingTeammates[section]?.matches_lost} matches
                  </p>
                  <p className="md:text-sm max-md:text-xs">
                    {((profileData?.losingTeammates[section].matches_won / (profileData?.losingTeammates[section].matches_won + profileData?.losingTeammates[section]?.matches_lost)) * 100).toFixed(0)}% winrate
                  </p>
                </div>
                <div className="w-full pr-3 h-full">
                  <div className="flex justify-center items-center">
                    <div className="grid grid-cols-2 text-center md:text-lg max-md:text-sm font-bold items-center w-full h-full gap-4 mt-3 mb-1">
                      <div>
                        <div className="">WINS</div>
                        <div className="">{profileData?.losingTeammates[section]?.matches_won}</div>
                      </div>
                      <div>
                        <div className="">LOSSES</div>
                        <div className="">{profileData?.losingTeammates[section]?.matches_lost}</div>
                      </div>  
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-lg relative mb-1">
                  {/* Green Success Bar */}
                    <div
                      className="bg-success h-2 absolute rounded-l-lg bg-opacity-60 border-r-2 border-base-300"
                      style={{
                        width: `${((profileData?.losingTeammates[section]?.matches_won / (profileData?.losingTeammates[section]?.matches_won + profileData?.losingTeammates[section]?.matches_lost)) * 100) || 0}%`,
                      }}
                    ></div>

                    {/* Red Error Bar */}
                    <div
                      className="bg-error h-2 absolute rounded-r-lg bg-opacity-60"
                      style={{
                        left: `${((profileData?.losingTeammates[section]?.matches_won / (profileData?.losingTeammates[section]?.matches_won + profileData?.losingTeammates[section]?.matches_lost)) * 100) || 0}%`,
                        width: `${100 - ((profileData?.losingTeammates[section]?.matches_won / (profileData?.losingTeammates[section]?.matches_won + profileData?.losingTeammates[section]?.matches_lost)) * 100) || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))}
          </div>
          <div className="w-full">
          <div className="flex justify-center items-center w-full max-md:mt-3">
            <div className="text-center text-xl font-bold">WORST WINRATE AGAINST</div>
          </div>
          {[0, 1, 2].map((section, index) => (
            <div key={index} className="flex items-center w-full">
              <div className="w-full rounded-lg flex items-center m-2 relative">
                <div className="flex w-full h-24 bg-base-100 rounded-lg shadow-lg border border-error max-md:p-2">
                  <div className="absolute right-2 top-2 text-xs md:hidden">{section + 1}</div>
                  <img src={`https://avatars.fastly.steamstatic.com/${profileData?.losingEnemies[section].enemy_id64 && profileData?.steamInfo[profileData?.losingEnemies[section].enemy_id64]?.avatar}_full.jpg`} className="md:w-24 md:m-2 md:h-20 max-md:h-22 max-md:w-12 object-cover object-top rounded-l" alt={`${profileData?.steamInfo[profileData?.losingEnemies[section].enemy_id64]?.name} image`}/>
                  <div className="mx-2 p-1 h-full text-left justify-center items-center md:w-2/6 max-md:w-2/5 border-r border-neutral">
                    <h2 className="md:text-2xl max-md:text-xs font-bold md:max-w-28 max-md:max-w-20 truncate overflow-hidden">
                      {profileData?.steamInfo[profileData?.losingEnemies[section].enemy_id64]?.name}
                    </h2>
                    <p className="md:text-sm max-md:text-xs">
                      {profileData?.losingEnemies[section].matches_won + profileData?.losingEnemies[section]?.matches_lost} matches
                    </p>
                    <p className="md:text-sm max-md:text-xs">
                      {((profileData?.losingEnemies[section].matches_won / (profileData?.losingEnemies[section].matches_won + profileData?.losingEnemies[section]?.matches_lost)) * 100).toFixed(0)}% winrate
                    </p>
                  </div>
                  <div className="w-full pr-3 h-full">
                    <div className="flex justify-center items-center">
                      <div className="grid grid-cols-2 text-center md:text-lg max-md:text-sm font-bold items-center w-full h-full gap-4 mt-3 mb-1">
                        <div>
                          <div className="">WINS</div>
                          <div className="">{profileData?.losingEnemies[section]?.matches_won}</div>
                        </div>
                        <div>
                          <div className="">LOSSES</div>
                          <div className="">{profileData?.losingEnemies[section]?.matches_lost}</div>
                        </div>  
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-lg relative mb-1">
                    {/* Green Success Bar */}
                      <div
                        className="bg-success h-2 absolute rounded-l-lg bg-opacity-60 border-r-2 border-base-300"
                        style={{
                          width: `${((profileData?.losingEnemies[section]?.matches_won / (profileData?.losingEnemies[section]?.matches_won + profileData?.losingEnemies[section]?.matches_lost)) * 100) || 0}%`,
                        }}
                      ></div>

                      {/* Red Error Bar */}
                      <div
                        className="bg-error h-2 absolute rounded-r-lg bg-opacity-60"
                        style={{
                          left: `${((profileData?.losingEnemies[section]?.matches_won / (profileData?.losingEnemies[section]?.matches_won + profileData?.losingEnemies[section]?.matches_lost)) * 100) || 0}%`,
                          width: `${100 - ((profileData?.losingEnemies[section]?.matches_won / (profileData?.losingEnemies[section]?.matches_won + profileData?.losingEnemies[section]?.matches_lost)) * 100) || 0}%`,
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

      <div className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-200">
      <button
        onClick={downloadProfileCard}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
      >
        Download Profile Card
      </button>
      </div>
    </div>
  );
};

export default Recap;
