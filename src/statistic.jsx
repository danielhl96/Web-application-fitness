import react from "react";
import api from "./api";
import { useState, useEffect } from "react";
function Statistic() {
  function ExerciseCards() {
    return (
      <div className="space-y-4 card w-full max-w-2xl bg-slate-800 border border-blue-500  shadow-sm p-8 rounded-md flex flex-col items-center">
        <h1 className="text-2xl font-bold justify-start text-amber-50 mb-4">
          Statistics
        </h1>

        <div className="grid grid-cols-3 space-x-2 justify-center items-center mt-4 text-xs">
          {data.map(
            (item, index) => (
              console.log(item),
              (
                <div className="overflow-auto-x max-h-40">
                  <div
                    key={index}
                    className=" items-center cursor-pointer"
                    onClick={() => {}}
                  >
                    <div
                      className={`card w-auto h-auto bg-slate-800 border-2 border-blue-500 shadow-sm p-2 rounded-md flex flex-col items-center mb-2`}
                    >
                      <h2 className="text-amber-50 font-bold mb-2">
                        {item.exercise_name}
                      </h2>
                      <figure className="w-9 h-9 mb-2">
                        <img
                          src={
                            "./" +
                            item.exercise_name
                              .toLowerCase()
                              .replace("-", "")
                              .replace(" ", "") +
                            ".png"
                          }
                          className="w-full h-full object-cover rounded-md"
                        />
                      </figure>
                      <div className="flex flex-row space-x-4">
                        <p className="text-slate-300 text-small">
                          Progress: {item.max_weight[0] / item.min_weight[0]} %
                        </p>
                        <p className="text-slate-300 text-small">
                          Max: {item.max_weight[0]} kg
                        </p>
                        <p className="text-slate-300 text-small">
                          Min: {item.min_weight[0]} kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    );
  }

  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/statistics").then((response) => {
      setData(response.data);
      console.log("Fetched statistics data:", response.data);
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center bg-slate-900  justify-center pb-8">
      {<ExerciseCards />}
    </div>
  );
}
export default Statistic;
