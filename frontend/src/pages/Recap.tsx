import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import medicImage from "../assets/portraits/medic.png";
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

  useEffect(() => {
    if (id64) {
      fetchProfileData();
    }
  }, [id64]);

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
            <div className="stats shadow rounded-md">
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

            <div className="stats shadow rounded-md ">
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

            <div className="stats shadow rounded-md">
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
            <div className="w-64 h-max rounded-lg flex items-center justify-center mb-2">
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
          <div className="grid grid-cols-1 md:gap-4 max-md:gap-2 max-w-4xl max-md:w-full md:w-full text-center">
            <div className="stats shadow rounded-md">
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

            <div className="stats shadow rounded-md">
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

            <div className="stats shadow rounded-md">
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
                  <div className="w-full h-24 bg-base-200 rounded-lg shadow-lg flex items-center mb-4 p-2 relative">
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
      <div className="h-screen w-full snap-start flex items-center justify-center bg-base-200">
        <div className="text-center w-full">
          <h2 className="text-2xl font-bold mb-4">Your Most Played Maps</h2>
          <section className="w-full">
            <div className="flex flex-col items-center w-full md:px-4 max-md:px-2">
              <div className="flex items-center justify-center w-full 2xl:w-1/2" >
                <div className=" text-xl font-bold md:mr-5 max-md:hidden">1.</div>
                <div className="w-full md:h-48 max-md:h-36 bg-base-100 rounded-lg border border-neutral shadow-lg flex items-center justify-center mb-4 relative">
                <div className="absolute right-2 top-2 text-xs md:hidden">1</div>
                  <div className="w-full h-full bg-base-100 rounded-lg shadow-lg flex items-center p-2">
                    
                    <img src={`/portraits/${profileData?.topFiveMaps[0].map_name}.png`} className="h-full w-[72px] object-cover object-top rounded-l" alt={`${profileData?.topFiveMaps[0].map_name} image`}
                    />
                    <div className="m-3 h-full text-left justify-center items-center w-2/5">
                      <h2 className="md:text-3xl max-md:text-lg font-semibold">
                        {profileData?.topFiveMaps[0].map_name.charAt(0).toUpperCase() + profileData?.topFiveMaps[0].map_name.slice(1).toLowerCase()}
                      </h2>
                      <p className="text-sm">
                        {(Number(profileData?.topFiveMaps[0].time_played) /60 /60).toFixed(1)}{" "}hrs
                      </p>
                      <p className="text-sm">
                        {profileData?.topFiveMaps[0].matches_played} matches
                      </p>
                      <p className="text-sm">
                        {((profileData?.topFiveMaps[0].wins / profileData?.topFiveMaps[0].matches_played) * 100).toFixed(0)}% winrate
                      </p>
                    </div>
                    <div className="flex justify-center items-center w-full gap-2">
                      <div className="justify-center items-center">
                        <div className="md:text-xl max-md:text-lg md:w-full max-md:mr-2 font-bold flex">
                          <div className="w-1/2 md:mr-10 md:ml-1 max-md:mr-5">WINS</div>
                          <div className="w-1/2 flex items-baseline text-right md:ml-10 max-md:ml-5">LOSSES</div>
                        </div>
                        <div className="md:text-4xl max-md:text-lg font-bold flex w-full">
                          <div className="w-1/2 text-left md:ml-2.5 max-md:ml-3">{profileData?.topFiveMaps[0]?.wins}</div>
                          <div className="mx-1">/</div>
                          <div className="w-1/2 text-right md:mr-3 max-md:mr-7">{profileData?.topFiveMaps[0]?.losses}</div>
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
                  <div className="w-full h-24 bg-base-100 rounded-lg shadow-lg flex items-center mb-4 p-2 relative">
                    <div className="absolute right-2 top-2 text-xs md:hidden">{section + 1}</div>
                    <img src={`/portraits/${profileData?.topFiveMaps[section].map_name}.png`} className="w-24 h-20 object-cover object-top rounded-l" alt={`${profileData?.topFiveMaps[section].map_name} image`}/>
                    <div className="m-3 h-full text-left justify-center items-center w-2/5">
                      <h2 className="md:text-3xl max-md:text-lg font-semibold">
                        {profileData?.topFiveMaps[section].map_name.charAt(0).toUpperCase() + profileData?.topFiveMaps[section].map_name.slice(1).toLowerCase()}
                      </h2>
                      <p className="text-sm">
                        {profileData?.topFiveMaps[section].matches_played} matches
                      </p>
                      <p className="text-sm">
                        {((profileData?.topFiveMaps[section].wins / profileData?.topFiveMaps[section].matches_played) * 100).toFixed(0)}% winrate
                      </p>
                    </div>
                    <div className="flex justify-center items-center w-full gap-2">
                      <div className="justify-center items-center">
                        <div className="md:text-xl max-md:text-lg md:w-full max-md:mr-2 font-bold flex">
                          <div className="w-1/2 md:mr-10 md:ml-1 max-md:mr-5">WINS</div>
                          <div className="w-1/2 flex items-baseline text-right md:ml-10 max-md:ml-5">LOSSES</div>
                        </div>
                        <div className="md:text-4xl max-md:text-lg font-bold flex w-full">
                          <div className="w-1/2 text-left md:ml-2.5 max-md:ml-3">{profileData?.topFiveMaps[section]?.wins}</div>
                          <div className="mx-1">/</div>
                          <div className="w-1/2 text-right md:mr-3 max-md:mr-7">{profileData?.topFiveMaps[section]?.losses}</div>
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
      <div className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-200">
        <div className="w-full h-full flex max-md:flex-col justify-center items-center 2xl:w-2/3">
          <div className="w-full">
          <div className="flex justify-center items-center w-full">
            <div className="text-center text-xl font-bold">BEST WINRATE WITH</div>
          </div>
          {[0, 1, 2].map((section, index) => (
          <div key={index} className="flex items-center w-full">
            <div className="w-full rounded-lg flex items-center m-2 relative">
              <div className="flex w-full h-24 bg-base-100 rounded-lg shadow-lg border border-success max-md:p-2">
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

      {/* Best Teammates & Enemies */}
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
    </div>
  );
};

export default Recap;
