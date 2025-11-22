import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { IoInformationCircleOutline } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import { useLinkStore } from "../../store/links";
import { useNavigate } from "react-router-dom";

const LinkRow = ({ link }) => {
  const navigate = useNavigate();
  const linkStore = useLinkStore();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);

  const openDeleteModal = () => {
    linkStore.setDeleteId(link.id);
    linkStore.toggleDeleteModal();
  };

  const redirectToInfo = () => {
    navigate(`/code/${link.short_code}`);
  };

  const redirectToUrl = () => {
    navigate(`/${link.short_code}`);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "url") {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } else {
        setCopiedShort(true);
        setTimeout(() => setCopiedShort(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const getShortUrl = () => {
    return `${window.location.origin}/${link.short_code}`;
  };

  return (
    <tr className="border-b border-blue-900/10 hover:bg-blue-900/5">
      <td className="p-4 text-[13.33px] text-blue-900 font-semibold">
        <div className="flex items-center gap-2">
          <a
            href={link.redirect_url}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
            title={link.redirect_url}
          >
            {truncateUrl(link.redirect_url, 50)}
          </a>
          <button
            onClick={() => copyToClipboard(link.redirect_url, "url")}
            className="hover:bg-blue-900/10 p-1 rounded transition-colors"
            title="Copy URL"
          >
            {copiedUrl ? (
              <IoCheckmark className="text-green-600" size={16} />
            ) : (
              <IoCopyOutline className="text-gray-500" size={16} />
            )}
          </button>
        </div>
      </td>

      <td className="p-4 text-[13.33px] font-medium">
        <div className="flex items-center gap-2">
          <span className="font-mono">{link.short_code}</span>
          <button
            onClick={() => copyToClipboard(getShortUrl(), "short")}
            className="hover:bg-blue-900/10 p-1 rounded transition-colors"
            title="Copy short URL"
          >
            {copiedShort ? (
              <IoCheckmark className="text-green-600" size={16} />
            ) : (
              <IoCopyOutline className="text-gray-500" size={16} />
            )}
          </button>
        </div>
      </td>

      <td className="p-4 text-[13.33px] font-medium">
        <span className="bg-blue-100 text-blue-900 px-2 py-1 rounded-full text-xs">
          {link.total_clicks}
        </span>
      </td>

      <td className="p-4 text-[13.33px] font-medium text-gray-600">
        {link.last_click_time
          ? new Date(link.last_click_time).toLocaleString()
          : "not clicked yet"}
      </td>

      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={redirectToInfo}
            className="hover:bg-blue-900/10 p-1.5 rounded transition-colors"
            title="View details"
          >
            <IoInformationCircleOutline
              className="text-blue-500 cursor-pointer"
              size={20}
            />
          </button>

          <button
            onClick={openDeleteModal}
            className="hover:bg-red-50 p-1.5 rounded transition-colors"
            title="Delete link"
          >
            <MdDelete className="text-red-500 cursor-pointer" size={20} />
          </button>

          <button
            onClick={redirectToUrl}
            className="hover:bg-blue-900/10 p-1.5 rounded transition-colors"
            title="Open link"
          >
            <LuSquareArrowOutUpRight
              className="text-blue-500 cursor-pointer"
              size={16}
            />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LinkRow;
