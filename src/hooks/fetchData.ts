import { useState, useEffect } from "react";
import axios from "axios";

export const useApiData = () => {
  const [apiFetchError, setApiFetchError] = useState<Error | null>(null);
  const [apiData, setApiData] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [totalElements, setTotalElements] = useState(0);

  const url = "https://api.spacexdata.com/v3/";

  async function fetchData(limit: number, offset: number) {
    setApiLoading(true);
    try {
      const response = await axios.get(
        `${url}launches?limit=${limit}&offset=${offset}`
      );
      const responseData = response.data;
      setTotalElements(Number(response.headers["spacex-api-count"]));

      setApiData((prevData) => [...prevData, ...responseData]);
      console.log(apiData);
    } catch (error: any) {
      setApiFetchError(error);
    } finally {
      setApiLoading(false);
    }
  }

  return { apiFetchError, apiData, apiLoading, totalElements, fetchData };
};
