import { useState } from "react";
import Calendar from "./components/Calendar";

function App() {
  const [day, setDay] = useState<Date | null>(null);
  return (
    <div className="p-8">
      <Calendar
        initialDate={new Date(2025, 4)}
        onClick={(day) => setDay(day)}
        datesToHighlight={[
          new Date(2025, 4, 3),
          new Date(2025, 4, 1),
          new Date(2025, 3, 16),
          new Date(2025, 3, 17),
          new Date(2025, 3, 18),
          new Date(2025, 3, 20),
        ]}
      />
      <h2>{day?.toDateString()}</h2>
    </div>
  );
}

export default App;
