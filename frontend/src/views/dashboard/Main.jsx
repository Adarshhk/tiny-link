import { useState, useMemo } from "react";
import { useLinkStore } from "../../store/links";
import LinkRow from "./LinkRow";
import AddModal from "../../components/AddModal";
import DeleteModal from "../../components/DeleteModal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

const Main = () => {
  const { links, toggleModal, loading } = useLinkStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedLinks = useMemo(() => {
    let filtered = links.filter(
      (link) =>
        link.redirect_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.short_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "last_click_time") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [links, searchTerm, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-gray-400 ml-1">↕</span>;
    }
    return (
      <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
    );
  };

  return (
    <div className="max-w-7xl w-[90%] mx-auto mt-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 border-b border-black/20">
        TiniU.rl
      </h1>

      <div className="w-full flex items-center justify-between my-4 gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by URL or short code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={toggleModal}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          Add New Link
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center w-full py-20">
          <AiOutlineLoading3Quarters
            className="animate-spin text-blue-500"
            size={40}
          />
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="text-left bg-blue-900/20 text-[12px] font-light border-b border-black/20">
                <th className="py-3 px-2">Original URL</th>
                <th className="py-3 px-2">Short Url</th>
                <th
                  className="py-3 px-2 cursor-pointer hover:bg-blue-900/10 select-none"
                  onClick={() => handleSort("total_clicks")}
                >
                  Click Count <SortIcon columnKey="total_clicks" />
                </th>
                <th
                  className="py-3 px-2 cursor-pointer hover:bg-blue-900/10 select-none"
                  onClick={() => handleSort("last_click_time")}
                >
                  Last Click <SortIcon columnKey="last_click_time" />
                </th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedLinks.length > 0 ? (
                filteredAndSortedLinks.map((link) => (
                  <LinkRow key={link.id} link={link} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-sm font-semibold text-center p-4"
                  >
                    {searchTerm
                      ? "No links match your search"
                      : "No Links Found!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <AddModal />
      <DeleteModal />
    </div>
  );
};

export default Main;
