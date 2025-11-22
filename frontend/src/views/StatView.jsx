import { useParams } from "react-router-dom";
import { useLinkStore } from "../store/links";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const StatView = () => {
  const { links, loading } = useLinkStore();
  const { short_code } = useParams();

  // find link once data is ready
  const selectedLink = links.find((l) => l.short_code === short_code) || null;

  // loading screen
  if (loading) {
    return (
      <div className="flex mt-4 flex-col items-center justify-center h-full text-gray-400 gap-4">
        <AiOutlineLoading3Quarters
          className="animate-spin text-blue-500"
          size={40}
        />
        <p className="text-lg">Fetching stats...</p>
      </div>
    );
  }

  // 404 state
  if (!selectedLink) {
    return (
      <div className="flex mt-4 flex-col items-center justify-center h-full text-gray-400">
        <p className="text-lg">No stats found for this link 😕</p>
      </div>
    );
  }

  return (
    <div className="p-4 mt-4 max-w-3xl mx-auto text-blue-900">
      <h1 className="text-2xl font-bold mb-4 border-b border-blue-900/5">
        Stats for {selectedLink.short_code}
      </h1>

      <div className="bg-blue-900/5 rounded-lg p-4 border border-blue-900/10 space-y-3">
        <p>
          <span className="font-semibold text-black/80 text-[13.33px]">
            Original URL:
          </span>{" "}
          <a
            href={selectedLink.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-[16px] font-bold hover:underline"
          >
            {selectedLink.redirect_url}
          </a>
        </p>

        <p>
          <span className="font-semibold text-black/80 text-[13.33px]">
            Shorten URL:
          </span>{" "}
          <a
            href={`${window.location.origin}/${selectedLink.short_code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-[16px] font-bold hover:underline"
          >
            {`${window.location.origin}/${selectedLink.short_code}`}
          </a>
        </p>

        <p className="text-[16px] font-bold">
          <span className="font-semibold text-black/80 text-[13.33px]">
            Total Clicks:
          </span>{" "}
          {selectedLink.total_clicks ?? 0} clicks
        </p>

        {selectedLink.last_click_time && (
          <p className="text-[16px] font-bold">
            <span className="font-semibold text-black/80 text-[13.33px]">
              Last Click:
            </span>{" "}
            {new Date(selectedLink.last_click_time).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatView;
