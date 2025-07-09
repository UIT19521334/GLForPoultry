import apiClient from '~/DomainApi/apiClient';

/**
 * Lấy danh sách chỉ số index rate
 */
export async function fetchListIndexRate({ unitcode, costcenter, acc_period_month, acc_period_year, search }) {
    try {
        const response = await apiClient.get('/master/list_index_rate', {
            params: { unitcode, costcenter, acc_period_month, acc_period_year, ...(search?.trim() ? { search } : {}) },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        return null;
    }
}

/**
 * Tạo mới chỉ số index rate
 */
export async function Create_IndexRate({ unitcode, costcenter, acc_period_month, acc_period_year, user }) {
    try {
        const response = await apiClient.post('/master/index_rate/header/create', null, {
            params: { unitcode, costcenter, acc_period_month, acc_period_year, user },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        return null;
    }
}

/**
 * Tạo chi tiết chỉ số index rate
 */
export async function Create_IndexRateDetail({ doc_code, unitcode, user, details }) {
    try {
        const response = await apiClient.post('/master/index_rate/detail/create', details, {
            params: { doc_code, unitcode, user },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi API tạo chi tiết Index Rate:', error);
        return null;
    }
}
/**
 * Cập nhật chi tiết chỉ số index rate
 */
export async function Update_IndexRateDetail({ doc_code, unitcode, user, details }) {
    try {
        const response = await apiClient.put('/master/index_rate/detail/update', details, {
            params: { doc_code, unitcode, user },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi API cập nhật chi tiết Index Rate:', error);
        return null;
    }
}

/**
 * Xóa chi tiết chỉ số index rate
 */
export async function Delete_IndexRateDetail({ doc_code, unitcode, user, detail_id }) {
    try {
        const response = await apiClient.delete('/master/index_rate/detail/delete', {
            params: { doc_code, unitcode, user, detail_id },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi API xóa chi tiết Index Rate:', error);
        return null;
    }
}
