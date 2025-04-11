import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
// import { useToast } from '@/components/ui/use-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('regular'); // 'regular' or 'school'
  const [dob, setDob] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  // const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (loginType === 'school') {
        // For school students, their DOB is their password
        // Parse DDMMYYYY format to a date object
        const day = parseInt(dob.slice(0, 2), 10);
        const month = parseInt(dob.slice(2, 4), 10);
        const year = parseInt(dob.slice(4), 10);
        const date = new Date(year, month - 1, day); // JavaScript months are 0-based
        const excelEpoch = new Date(1899, 11, 30);
        const diffInMs = date.getTime() - excelEpoch.getTime();
        const formattedDob = Math.floor(diffInMs / (1000 * 60 * 60 * 24))+1;
        
        await login(email, formattedDob.toString(), formattedDob.toString()); // Pass original DOB as password, formatted DOB as date

      } else {
        // Regular login with password
        await login(email, password);
      }
      // toast({
      //   title: "Login successful",
      //   description: "You have been logged in successfully.",
      // });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // toast({
      //   variant: "destructive",
      //   title: "Login failed",
      //   description: "Please check your credentials and try again.",
      // });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2 py-2">
        <Checkbox 
          id="school-login" 
          checked={loginType === 'school'}
          onCheckedChange={(checked) => 
            setLoginType(checked ? 'school' : 'regular')
          }
        />
        <Label htmlFor="school-login">
          I am a school student
        </Label>
      </div>

      {loginType === 'school' ? (
        <div>
          <Label htmlFor="dob" className="block text-sm font-medium mb-1">
            Date of Birth (Your Password)
          </Label>
          <Input
            id="dob"
            type="text"
            placeholder="Format: DDMMYYYY (e.g., 01012000)"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter your date of birth as DDMMYYYY (e.g., January 1, 2000 would be 01012000)
          </p>
        </div>
      ) : (
        <div>
          <Label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      )}
      
      <Button type="submit" className="w-full border-white hover:border-slate-400 hover:text-slate-400 mb-5 border-2 mt-2 ">
        Login
      </Button>
    </form>
  );
}