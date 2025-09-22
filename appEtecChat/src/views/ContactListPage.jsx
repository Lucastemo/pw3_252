import { useState, useEffect } from 'react';
import ContactItem from '../components/ContactItem';
import { db, auth } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';

const ContactList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'contacts');
        // 🔍 Filtrando contatos do usuário logado
        const q = query(usersCollection, where('createdBy', '==', auth.currentUser.uid));       //AQUI 
        const userSnapshot = await getDocs(q);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Erro ao deletar contato:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-cont/${id}`);
  };

  const handleOpenChat = (id) => {
    navigate(`/chat/${id}`);
  };


  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Header pageTitle='🤖 Lista de Contatos'/>

	  <div className="contact-list">
        {users.length === 0 ? (
          <div>Não há contatos disponíveis.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} onClick={() => handleOpenChat(user.id)} className="contact-item" >
             <ContactItem 
                  user={user} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
            </div>
          ))
        )}

		{/* Botão flutuante, aqui abaixo */}
		<Link to="/add-cont">         <div className="floating-button">
			{/* <span>+</span> */}
			</div>
		</Link>

      </div>
    </>
  );
};

export default ContactList;


