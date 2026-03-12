import React, { useState, useEffect } from 'react';
import { UserPlus, Search, QrCode, Trash2, Edit2, UserCheck, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { db, Member } from '../db/database';
import BarcodeGenerator from './BarcodeGenerator';
import BarcodeScanner from './BarcodeScanner';

export const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showBarcode, setShowBarcode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    belt: 'white',
    notes: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const allMembers = await db.getAllMembers();
    setMembers(allMembers);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await db.addMember({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        belt: formData.belt,
        stripes: 0,
        notes: formData.notes
      });

      setFormData({ name: '', email: '', phone: '', belt: 'white', notes: '' });
      setShowAddForm(false);
      loadMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Erro ao cadastrar membro');
    }
  };

  const handleScan = async (barcode: string) => {
    const member = await db.getMemberByBarcode(barcode);
    if (member) {
      setSelectedMember(member);
      // Realizar check-in automaticamente
      const result = await db.checkIn(barcode);
      alert(result.message);
      loadMembers();
    } else {
      alert('Membro não encontrado');
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.barcode.includes(searchTerm)
  );

  const beltColors: Record<string, string> = {
    white: 'bg-gray-200',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    brown: 'bg-amber-700',
    black: 'bg-gray-900'
  };

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Gerenciar Alunos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <QrCode className="w-5 h-5" />
            <span>Scan</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>Novo</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nome, email ou código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-800 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{members.length}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <UserCheck className="w-4 h-4" />
            <span className="text-sm">Ativos</span>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {members.filter(m => m.active).length}
          </p>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-3 h-12 rounded-full ${beltColors[member.belt] || 'bg-gray-600'}`} />
              <div>
                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-gray-400">{member.email}</p>
                <p className="text-xs text-gray-500">Código: {member.barcode}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedMember(member);
                  setShowBarcode(true);
                }}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <QrCode className="w-5 h-5 text-blue-400" />
              </button>
              
              <button
                onClick={() => {
                  // Toggle active status
                  db.updateMember(member.id!, { active: !member.active });
                  loadMembers();
                }}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Edit2 className="w-5 h-5 text-yellow-400" />
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir?')) {
                    db.deleteMember(member.id!);
                    loadMembers();
                  }
                }}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Member Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 p-6 rounded-xl w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-white mb-4">Cadastrar Novo Aluno</h2>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Faixa</label>
                <select
                  value={formData.belt}
                  onChange={(e) => setFormData({ ...formData, belt: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                >
                  <option value="white">Branca</option>
                  <option value="blue">Azul</option>
                  <option value="purple">Roxa</option>
                  <option value="brown">Marrom</option>
                  <option value="black">Preta</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Scanner */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Barcode Display */}
      {showBarcode && selectedMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-xl w-full max-w-sm"
          >
            <h3 className="text-lg font-bold text-center text-black mb-4">
              Carteirinha - {selectedMember.name}
            </h3>
            
            <BarcodeGenerator value={selectedMember.barcode} />
            
            <p className="text-center text-gray-600 text-sm mt-4">
              {selectedMember.barcode}
            </p>
            
            <button
              onClick={() => {
                setShowBarcode(false);
                setSelectedMember(null);
              }}
              className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              Fechar
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
