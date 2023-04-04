import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

export default function ListLaunches() {
  const [isIntersecting, setIntersecting] = useState(false);
  const [apiFetchError, setApiFetchError] = useState<Error | null>(null);
  const [apiData, setApiData] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [end, setEnd] = useState(0);
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
      console.log(responseData.length);
      if (response.data.length >= 0) {
        setEnd((prevState) => prevState + responseData.length);
      }

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
    if (firstEntry.isIntersecting) {
      console.log("prolaziii", apiData.length);
      fetchData(limit, offset);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if (observer && containerRef.current) {
      observer.observe(containerRef.current);
    }
    if (totalElements > 0) {
      if (end >= totalElements) {
        observer.unobserve(containerRef.current as Element);
      }
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [apiData]);
  if (apiLoading) {
    return <div>Loading</div>;
  }
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
