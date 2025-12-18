import { useEffect, useState } from "react";

export default function useFetch(fetchFunc, dependencies = []) {
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchFunc();
        if (!mounted) return;
        setState(data || {});
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFunc, ...dependencies]);

  return { state, loading, error };
}
