import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useApiData } from "../../../hooks/fetchData";
import { useIntersectionObserver } from "../../../hooks/infiniteScroll";

export default function ListLaunches() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const { apiFetchError, apiData, apiLoading, totalElements, fetchData } =
    useApiData();

  const ref = useIntersectionObserver(
    onIntersection,
    apiData.length,
    totalElements
  );

  function onIntersection(entries: any) {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting) {
      setOffset((prevState) => prevState + 20);
      fetchData(limit, offset);
    }
  }

  // if (apiLoading) {
  //   return <div>Loading</div>;
  // }
  return (
    <div>
      <div>
        {apiData.map((launch: any, index) => {
          return <div key={index}>{launch.mission_name}</div>;
        })}
      </div>
      <div ref={ref}></div>
    </div>
  );
}
