import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { authApi, type LoginBody, type RegisterBody, type SendOtpBody, type ForgotPasswordBody } from '../api/auth';

// Send OTP Mutation
export const useSendOtp = () => {
  return useMutation({
    mutationFn: (body: SendOtpBody) => authApi.sendOtp(body),
  });
};

// Register Mutation
export const useRegister = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (body: RegisterBody) => authApi.register(body),
    onSuccess: () => {
      navigate('/auth/login?registered=true');
    },
  });
};

// Login Mutation
export const useLogin = (redirectTo?: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (body: LoginBody) => authApi.login(body),
    onSuccess: async () => {
      // Invalidate và refetch user info sau khi login
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate(redirectTo || '/');
    },
  });
};

// Logout Mutation
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      return authApi.logout(refreshToken);
    },
    onSuccess: () => {
      // Remove auth/me cache khi logout
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
      queryClient.clear();
      navigate('/auth/login');
    },
    onError: () => {
      // Clear tokens even if logout fails
      localStorage.removeItem('accessToken');
      Cookies.remove('refreshToken');
      // Remove auth/me cache khi logout
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
      queryClient.clear();
      navigate('/auth/login');
    },
  });
};

// Forgot Password Mutation
export const useForgotPassword = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (body: ForgotPasswordBody) => authApi.forgotPassword(body),
    onSuccess: () => {
      navigate('/auth/login?passwordReset=true');
    },
  });
};

// Get Google Link Mutation
export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: () => authApi.getGoogleLink(),
    onSuccess: (data) => {
      if (data?.data?.link) {
        window.location.href = data.data.link;
      }
    },
  });
};

