// import React, { useState } from "react";

// const Checkbox = ({
//   string,
//   checkedStatus,
// }: {
//   string: string;
//   checkedStatus: boolean;
// }) => {
//   const [isChecked, setIsChecked] = useState<boolean>(checkedStatus);

//   const handleChange = () => {
//     setIsChecked(!isChecked);
//   };

//   return (
//     <>
//       <label>
//         <input type="checkbox" checked={isChecked} onChange={handleChange} />
//         <span>{string}</span>
//       </label>
//     </>
//   );
// };
// export default Checkbox;

import { useState } from "react";

const Checkbox = ({
  string,
  checkedStatus,
}: {
  string: string;
  checkedStatus: boolean;
}) => {
  const [isChecked, setIsChecked] = useState(checkedStatus);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <>
      <label>
        <input type="checkbox" checked={isChecked} onChange={handleChange} />
        <span>{string}</span>
      </label>
    </>
  );
};
export default Checkbox;
