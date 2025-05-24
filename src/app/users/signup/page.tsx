"use client";
import { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { validatePassword } from '@/utils/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isProducer, setIsProducer] = useState(false);

  // Producer fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Minas Gerais');
  const [zipCode, setZipCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [cultivationMethods, setCultivationMethods] = useState<string[]>([]);

  // Profile picture
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleCultivationMethodChange = (method: string) => {
    if (cultivationMethods.includes(method)) {
      setCultivationMethods(cultivationMethods.filter(m => m !== method));
    } else {
      setCultivationMethods([...cultivationMethods, method]);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePicture(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula e um caractere especial.');
      return;
    }

    if (isProducer) {
      // Validate producer fields
      if (!name || !description || !phone || !address || !city || !zipCode || !latitude || !longitude) {
        toast.error('Todos os campos do produtor são obrigatórios.');
        return;
      }

      if (cultivationMethods.length === 0) {
        toast.error('Selecione pelo menos um método de cultivo.');
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('email', email);
      formData.append('isProducer', isProducer.toString());

      if (isProducer) {
        formData.append('name', name);
        formData.append('description', description);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('zipCode', zipCode);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('cultivationMethods', JSON.stringify(cultivationMethods));

        if (profilePicture) {
          formData.append('profilePicture', profilePicture);
        }
      }

      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        localStorage.setItem('signupSuccessMessage', isProducer ? 'Produtor criado com sucesso!' : 'Usuário criado com sucesso!');
        router.push("/login");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || errorData.message);
      }
    } catch (error) {
      toast.error('Erro ao enviar requisição: ' + error);      
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-8 rounded shadow-md w-full max-w-2xl rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-black">Criar nova conta</h1>

        {/* Basic User Information */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-black">Informações básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded text-black"
              required
            />
            <input
              type="text"
              placeholder="Nome do usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 rounded text-black"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded text-black"
              required
            />
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 rounded text-black"
              required
            />
          </div>
        </div>

        {/* Producer Toggle */}
        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isProducer}
              onChange={() => setIsProducer(!isProducer)}
              className="form-checkbox h-5 w-5 text-secondary"
            />
            <span className="text-black">Sou um produtor de morangos</span>
          </label>
        </div>

        {/* Producer Information (conditionally rendered) */}
        {isProducer && (
          <div className="border-t pt-4 mt-2">
            <h2 className="text-xl font-semibold mb-4 text-black">Informações do Produtor</h2>

            {/* Profile Picture Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Foto de Perfil</label>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-full overflow-hidden bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <Image 
                      src={previewUrl} 
                      alt="Preview" 
                      width={96} 
                      height={96} 
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm text-center">Clique para<br/>adicionar foto</span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  accept="image/*"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline text-sm"
                  >
                    {previewUrl ? 'Alterar foto' : 'Adicionar foto'}
                  </button>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePicture(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-red-500 hover:underline text-sm ml-4"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Producer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome do Produtor/Empresa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded text-black"
                required={isProducer}
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-2 rounded text-black"
                required={isProducer}
              />
              <input
                type="text"
                placeholder="Endereço"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border p-2 rounded text-black"
                required={isProducer}
              />
              <input
                type="text"
                placeholder="Cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border p-2 rounded text-black"
                required={isProducer}
              />
              <input
                type="text"
                placeholder="Estado"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="border p-2 rounded text-black"
                required={isProducer}
              />
              <input
                type="text"
                placeholder="CEP"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="border p-2 rounded text-black"
                required={isProducer}
              />
              <input
                type="text"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="border p-2 rounded text-black"
                required={isProducer}
              />
              <input
                type="text"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="border p-2 rounded text-black"
                required={isProducer}
              />
              <div className="md:col-span-2">
                <textarea
                  placeholder="Descrição do produtor"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2 rounded text-black w-full"
                  rows={3}
                  required={isProducer}
                ></textarea>
              </div>
            </div>

            {/* Cultivation Methods */}
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Métodos de Cultivo</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Orgânico', 'Hidropônico', 'Tradicional', 'Semi-hidropônico', 'Vertical', 'Familiar'].map((method) => (
                  <label key={method} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cultivationMethods.includes(method)}
                      onChange={() => handleCultivationMethodChange(method)}
                      className="form-checkbox h-4 w-4 text-secondary"
                    />
                    <span className="text-black text-sm">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="btn-secondary mt-6">
          {isProducer ? 'Criar Conta de Produtor' : 'Criar Usuário'}
        </button>
      </form>
    </div>
  );
}
