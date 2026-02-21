export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  // Match backend requirement: !@#$%^&*
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateVideoFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const validExtensions = ['.mp4', '.mov', '.avi', '.mkv'];
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  if (!validExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${validExtensions.join(', ')}`,
    };
  }
  
  const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 2GB limit',
    };
  }
  
  return { valid: true };
}

