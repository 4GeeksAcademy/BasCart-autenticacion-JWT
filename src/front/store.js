export const initialStore = () => {
    const token = sessionStorage.getItem("jwt-token"); 
    return {
        token: token || null,
        message: null, 
        currentUser: null, 
        todos: []
    };
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case 'set_hello':
            return {
                ...store,
                message: action.payload
            };

        case 'add_task':
            const { id, color } = action.payload;
            return {
                ...store,
                todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
            };

        
        case 'SET_TOKEN':
            
            if (action.payload.token) {
                sessionStorage.setItem("jwt-token", action.payload.token);
            } else {
                sessionStorage.removeItem("jwt-token");
            }
            return {
                ...store,
                token: action.payload.token,
                currentUser: action.payload.user || null, 
                message: action.payload.message || null 
            };

        case 'SET_MESSAGE':
            
            return {
                ...store,
                message: action.payload
            };

        case 'CLEAR_AUTH':
            
            sessionStorage.removeItem("jwt-token");
            return {
                ...store,
                token: null,
                currentUser: null,
                message: "Sesión cerrada exitosamente"
            };

        default:
            throw Error('Unknown action.');
    }
}