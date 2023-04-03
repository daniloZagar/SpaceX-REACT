import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

export default function ListLaunches() {
  const [isIntersecting, setIntersecting] = useState(false);
  const [apiFetchError, setApiFetchError] = useState<Error | null>(null);
  const [apiData, setApiData] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const limit = 20;
  const [totalElements, setTotalElements] = useState(0);
  const url = "https://api.spacexdata.com/v3/";
  async function fetchData(limit: number, offset: number) {
    try {
      const response = await axios.get(
        `${url}launches?limit=${limit}&offset=${offset}`
      );
      const responseData = response.data;

      setTotalElements(Number(response.headers["spacex-api-count"]));

      setApiData((prevData) => [...prevData, ...responseData]);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error: any) {
      setApiFetchError(error);
    } finally {
      setApiLoading(false);
    }
  }
  function onIntersection(entries: any) {
    const firstEntry = entries[0];
    console.log("intersection", apiData);
    console.log("isIntersec", isIntersecting);
    if (firstEntry.isIntersecting && offset - totalElements < 20) {
      console.log("prolaziii", apiData.length);
      fetchData(limit, offset);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if (observer && containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [apiData]);
  return (
    <div>
      <div>
        {apiData.map((launch: any, index) => {
          return <div key={index}>{launch.mission_name}</div>;
        })}
      </div>
      <div ref={containerRef}></div>
    </div>
  );
}
