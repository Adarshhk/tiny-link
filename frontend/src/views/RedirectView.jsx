import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLinkStore } from "../store/links";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RedirectView = () => {
  const { links, loading, incrementClickCount } = useLinkStore();
  const { short_code } = useParams();

  // compute redirect link purely from state (no setState)
  const redirect = links.find((l) => l.short_code === short_code);

  useEffect(() => {
    if (loading) return; // wait for data
    if (!redirect) return; // no match → do nothing (404 will show)

    incrementClickCount(redirect.id);
    window.location.href = redirect.redirect_url;
  }, [loading, redirect, incrementClickCount]);

  // still loading
  if (loading) {
    return (
      <div className="w-full mt-8 flex flex-col justify-center items-center gap-4">
        <AiOutlineLoading3Quarters
          className="animate-spin text-blue-500"
          size={40}
        />
        <p className="text-blue-900 font-semibold text-[14px]">
          Redirecting...
        </p>
      </div>
    );
  }

  // not loading + redirect not found → 404
  if (!redirect) {
    return (
      <div className="w-full mt-8 flex flex-col justify-center items-center gap-4">
        <p className="text-red-500 font-bold text-[16px]">
          404 — Link Not Found
        </p>
      </div>
    );
  }

  // shouldn't reach here because redirect triggers before render finishes
  return null;
};

export default RedirectView;
