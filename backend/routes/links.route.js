import { Router } from "express";
import pool from "../db/db.js";

const router = Router();

router.get('/api/links', async (req, res) => {
    try {
        const links = await pool.query('SELECT * FROM links');
        return res.status(200).json({ data: links.rows, message: 'Links retrieved successfully', success: true });
    } catch (error) {
        console.error('error in getting links', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.post('/api/links', async (req, res) => {

    try {
        const { short_code, redirect_url } = req.body;

        if (!short_code || !redirect_url) {
            return res.status(400).json({ data: null, message: 'short_code and redirect_url are required', success: false });
        }

        const newLink = await pool.query('INSERT INTO links (short_code , redirect_url) VALUES ($1 , $2) RETURNING *', [short_code, redirect_url]);

        if (!newLink) {
            return res.status(500).json({ data: null, message: 'Error creating link', success: false });
        }

        return res.status(201).json({ data: newLink.rows[0], message: 'Link created successfully', success: true });
    } catch (error) {
        console.error('error in creating link', error);
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Short Code Already Exists.",
                success: false,
                data: null
            });
        }
        return res.status(500).json({ message: 'Internal Server Error', data: null, success: false });
    }
})


router.put('/api/links/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { short_code, redirect_url } = req.body;

        if (!short_code || !redirect_url) {
            return res.status(400).json({ data: null, message: 'short_code and redirect_url are required', success: false });
        }

        if (!id) {
            return res.status(400).json({ data: null, message: 'invalid link', success: false });
        }

        const link = await pool.query('UPDATE links SET short_code = $1 , redirect_url = $2 WHERE id = $3 RETURNING *', [short_code, redirect_url, id]);

        if (!link) {
            return res.status(500).json({ data: null, message: 'Error updating link', success: false });
        }

        return res.status(200).json({ data: link.rows[0], message: 'Link updated successfully', success: true });

    } catch (error) {
        console.error('error in updating link', error);
        return res.status(500).json({ message: 'Internal Server Error', data: null, success: false });
    }
})

router.delete('/api/links/:id', async (req, res) => {

    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ data: null, message: 'invalid link', success: false });
        }

        const deleteLink = await pool.query('DELETE FROM links WHERE id = $1 RETURNING *', [id]);
        if (!deleteLink) {
            return res.status(500).json({ data: null, message: 'Error deleting link', success: false });
        }
        return res.status(200).json({ data: deleteLink.rows[0], message: 'Link deleted successfully', success: true });
    } catch (error) {
        console.error('error in deleting link', error);
        return res.status(500).json({ message: 'Internal Server Error', data: null, success: false });
    }
})


router.put('/api/links/increment-click/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ data: null, message: 'invalid link', success: false });
        }

        const link = await pool.query('UPDATE links SET total_clicks = total_clicks + 1 , last_click_time = $1 WHERE id = $2 RETURNING *', [new Date(), id]);

        if (!link) {
            return res.status(500).json({ data: null, message: 'Error updating link clicks', success: false });
        }
        return res.status(200).json({ data: link.rows[0], message: 'Link clicks updated successfully', success: true });
    } catch (error) {
        console.error('error in updating link clicks', error);
        return res.status(500).json({ message: 'Internal Server Error', data: null, success: false });
    }

})

export default router;