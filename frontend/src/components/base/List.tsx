import { useEffect } from "react";
import { useStore, StoreState } from "../../store/index";
import Checkbox from "./Checkbox";
import OpenQuestion from "./OpenQuestion";
// const { surveys, fetchSurveys, isLoading }: StoreState = useStore();

// const List = () => {
//   const surveys = useStore((state: StoreState) => state.surveys);
//   const fetchSurveys = useStore((state: StoreState) => state.fetchSurveys);
//   const isLoading = useStore((state: StoreState) => state.isLoading);

//   useEffect(() => {
//     fetchSurveys();
//   }, []);

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div className="space-y-4">
//       {surveys?.map((survey) => (
//         <div key={survey.id} className="p-4 border rounded">
//           <p>{survey.title}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default List;

const List = () => {
  const surveys = useStore((state: StoreState) => state.surveys);
  const fetchSurveys = useStore((state: StoreState) => state.fetchSurveys);
  const isLoading = useStore((state: StoreState) => state.isLoading);

  useEffect(() => {
    const load = async () => {
      console.log("Fetching surveys...");
      await fetchSurveys();
      console.log("Surveys:", surveys); // Check what data we get
    };
    load();
  }, []);

  console.log("Rendering with surveys:", surveys); // Check on each render

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {Array.isArray(surveys) && surveys.length > 0 ? (
        surveys.map((survey) => (
          <div key={survey.id} className="p-4 border rounded">
            <p>{survey.title}</p>

            <div>
              {survey.questions.map((question) => (
                <div key={question.id}>
                  <p>{question.label}</p>
                  <p>{question.type}</p>

                  {question.type === "checkbox" && (
                    <Checkbox
                      string={question.label}
                      checkedStatus={question.checked || false}
                    />
                  )}

                  {question.type === "open" && (
                    <OpenQuestion
                      question={question.label}
                      answer={""}
                      placeholder={"insert your answer here"}
                      maxLength={20}
                      //   onSave={answer}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>No surveys found</div>
      )}
    </div>
  );
};
export default List;
