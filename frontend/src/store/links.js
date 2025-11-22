import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

export const useLinkStore = create((set) => ({
    links: [],
    showModal: false,
    showDeleteModal: false,
    deleteId: null,
    loading: false,

    toggleDeleteModal: () => set((state) => ({ showDeleteModal: !state.showDeleteModal })),
    toggleModal: () => set((state) => ({ showModal: !state.showModal })),

    getLinks: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/links");
            set({ links: res.data.data });
        } catch (error) {
            console.error("Error fetching links:", error);
            toast.error(error.response.data.message);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    incrementClickCount: async (id) => {
        try {
            const res = await axios.put(`/links/increment-click/${id}`);
            if (res.data) {
                return res.data;
            }
        } catch (error) {
            console.error("Error incrementing click count:", error);
            toast.error(error.response.data.message);
            throw error;
        }
    },

    addLink: async ({ redirect_url, short_code }) => {
        set({ loading: true });
        try {
            const res = await axios.post("/links", { redirect_url, short_code });
            if (res.data) {
                toast.success(res.data.message);

                return res.data;
            }
        } catch (error) {
            console.error("Error adding link:", error);
            toast.error(error.response.data.message);

            throw error;
        } finally {
            set({ loading: false });
        }
    },

    editLink: async (id, updatedFields) => {
        try {
            const res = await axios.put(`/links/${id}`, updatedFields);
            if (res.data) {
                return res.data;
            }
        } catch (error) {
            console.error("Error editing link:", error);
            throw error;
        }
    },



    deleteLink: async (id) => {
        set({ loading: true });
        try {
            const res = await axios.delete(`/links/${id}`);
            if (res.data) {
                toast.success(res.data.message);

                return res.data;
            }
        } catch (error) {
            console.error("Error deleting link:", error);
            toast.error(error.response.data.message);

            throw error;
        } finally {
            set({ loading: false });
        }
    },

    setDeleteId: (id) => set(() => ({ deleteId: id }))

}));
