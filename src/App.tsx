import { useState } from "react";
import Calendar from "./components/Calendar";

function App() {
  const [day, setDay] = useState<Date | null>(null);
  return (
    <div className="p-8">
      <Calendar
        initialDate={new Date(2025, 4)}
        onClick={(day) => setDay(day)}
      />
      <h2>{day?.toDateString()}</h2>
    </div>
  );
}

export default App;
