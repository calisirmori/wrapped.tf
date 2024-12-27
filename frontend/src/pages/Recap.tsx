import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import medicImage from '../assets/portraits/medic.png';
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
      {/* Global Stats */}
      <div
        className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-100 p-4"
        data-index="0"
      >
        <h1 className="text-3xl font-bold mb-4">
          Hey {id64 && profileData?.steamInfo[id64]?.name}!
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Before we tell you about your 2024 recap lets look at some global
          stats.
        </p>
        <p className="text-lg text-gray-600 text-center">
          You are one of <strong>20,960</strong> players this year
        </p>
        <p className="text-lg text-gray-600 text-center">
          There was total of 2,489,473 matches this year
        </p>
        <p className="text-lg text-gray-600 text-center">
          That made up total playtime of 3,275,888,886 seconds of gameplay, That
          is around 104 years of gameplay! There was 36,225,975 kills and
          36,647,001 death (that makes 421,026 suicides!)
        </p>
      </div>

      {/* General Info Section */}
      <div className="h-screen w-full snap-start flex flex-col items-center justify-center bg-base-200 md:p-8 max-md:p-3 relative">
        {/* Character/Image */}
        <div className=" text-center mb-4 md:hidden">
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
        <div className="flex md:gap-4 max-md:gap-2 justify-center items-center md:w-1/2 max-md:w-full">
          <div className="grid grid-cols-1 md:gap-4 max-md:gap-2 max-w-4xl max-md:w-1/2 md:w-full">
            <div className="stats shadow rounded-md">
              <div className="stat max-md:p-3">
                <div className="stat-title max-md:text-xs">
                  Most played class
                </div>
                <div className="stat-value max-md:text-base">
                  {classes[profileData?.topFiveClasses[0].class_name]}
                </div>
                <div className="stat-desc max-md:text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  Just like 14532 others
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
          <div className=" text-center max-md:hidden">
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

          <div className="grid grid-cols-1 md:gap-4 max-md:gap-2 max-w-4xl max-md:w-1/2 md:w-full">
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

      {/* Filler Card 1 */}
      <div className="h-screen w-full snap-start flex items-center justify-center bg-base-300">
        <div className="text-center w-full">
          <h2 className="text-2xl font-bold mb-4">Your Most Played Classes</h2>
          <section className="w-full">
            <div className="flex flex-col items-center w-full px-4">
              <div className="flex items-center justify-center w-full md:w-1/2">
                <div className=" text-xl font-bold mr-5">1.</div>
                <div className="w-full md:h-48 bg-base-100 rounded-lg shadow-lg flex items-center justify-center mb-4">
                  <h2 className="text-2xl md:text-4xl font-bold">
                    Top Section
                  </h2>
                </div>
              </div>

              {/* Other Sections */}
              {[1, 2, 3, 4].map((section, index) => (
                <div key={index} className="md:w-1/2 flex items-center">
                  <div className=" text-xl font-bold mr-5">{section + 1}.</div>
                  <div className="w-full h-24 bg-base-200 rounded-lg shadow-lg flex items-center mb-4 p-2">
                    <img
                      src={`/portraits/${profileData?.topFiveClasses[section].class_name}.png`}
                      className="w-24 h-20 object-cover object-top rounded-l"
                      alt={`${profileData?.topFiveClasses[section]?.class_name} image`}
                    />
                    <div className="m-3 h-full text-left justify-center items-center w-1/5">
                      <h2 className="text-3xl font-semibold">
                        {
                          classes[profileData?.topFiveClasses[section].class_name]
                        }
                      </h2>
                      <p className="text-sm">
                        {(
                          Number(
                            profileData?.topFiveClasses[section].time_played
                          ) /
                          60 /
                          60
                        ).toFixed(1)}{" "}
                        hrs
                      </p>
                      <p className="text-sm">
                        {profileData?.topFiveClasses[section].matches_played}{" "}
                        matches
                      </p>
                    </div>
                    <div className=" grid grid-flow-col grid-cols-3 w-full gap-2">
                      <div className="">
                        <div className="text-xl font-bold -mb-1">
                          KDA{" "}
                          <span className="text-xs text-opacity-10">{` (${(
                            (profileData?.topFiveClasses[section]?.kills +
                              profileData?.topFiveClasses[section]?.assists) /
                            profileData?.topFiveClasses[section]?.deaths
                          ).toFixed(2)})`}</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {profileData?.topFiveClasses[section].kills} /{" "}
                          {profileData?.topFiveClasses[section].deaths} /{" "}
                          {profileData?.topFiveClasses[section].assists}
                        </div>
                      </div>
                      <div className="text-center border-x border-neutral">
                        <div className="text-lg font-bold flex justify-center items-center -mb-2">
                          <div className="w-1/2 text-right">WON</div>
                          <div className="mx-2 text-2xl">-</div>
                          <div className="w-1/2 text-left">LOST</div>
                        </div>
                        <div className="text-2xl font-bold flex justify-center items-center">
                          <div className="w-1/2 text-right">{profileData?.topFiveClasses[section].wins}</div>
                          <div className="mx-2 text-2xl">-</div>
                          <div className="w-1/2 text-left">{profileData?.topFiveClasses[section].losses}</div>
                        </div>
                      </div>
                      <div>a</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Filler Card 2 */}
      <div
        className="h-screen w-full snap-start flex flex-col items-center justify-center bg-green-500 text-white p-6"
        data-index="2"
      >
        <h2 className="text-2xl font-bold mb-4">Filler Card 2</h2>
        <p>Use this card to validate snapping behavior on all screen sizes.</p>
      </div>

      {/* Filler Card 3 */}
      <div
        className="h-screen w-full snap-start flex items-center justify-center bg-purple-500 text-white"
        data-index="3"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">Filler Card 3</h2>
          <p className="mt-4">
            This section demonstrates snapping and responsive behavior.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recap;
