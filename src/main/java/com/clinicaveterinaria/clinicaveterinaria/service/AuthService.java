package com.clinicaveterinaria.clinicaveterinaria.service;

import com.clinicaveterinaria.clinicaveterinaria.model.dto.*;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Cliente;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Secretario;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Usuario;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Veterinario;
import com.clinicaveterinaria.clinicaveterinaria.model.enums.UsuarioRole;
import com.clinicaveterinaria.clinicaveterinaria.repository.UsuarioRepository;
import com.clinicaveterinaria.clinicaveterinaria.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService { // Implementa UserDetailsService

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private AuthenticationManager authenticationManager; // Precisa ser injetado do SecurityConfig

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(email);
    }

    public TokenResponseDTO login(AuthDTO authDTO) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(authDTO.getEmail(), authDTO.getSenha());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        Usuario usuario = (Usuario) auth.getPrincipal();
        String token = tokenService.generateToken(usuario);
        return new TokenResponseDTO(token, usuario.getRole().name());
    }

    public ClienteDTO registerCliente(ClienteDTO clienteDTO) {
        if (this.usuarioRepository.findByEmail(clienteDTO.getEmail()) != null) {
            throw new RuntimeException("Email já cadastrado."); // Exceção mais específica em produção
        }
        String encryptedPassword = passwordEncoder.encode(clienteDTO.getSenha());
        Cliente newCliente = new Cliente(
                clienteDTO.getEmail(),
                encryptedPassword,
                clienteDTO.getNomeCompleto(),
                clienteDTO.getTelefone(),
                clienteDTO.getCpf()
        );
        Cliente savedCliente = usuarioRepository.save(newCliente);
        clienteDTO.setId(savedCliente.getId());
        clienteDTO.setSenha(null); // Não retornar a senha
        return clienteDTO;
    }

    // Métodos para registro de Secretário e Veterinário (apenas para ADMIN ou outro Secretário)
    // Devem ser protegidos por `@PreAuthorize` no controller ou lógica no service
    public SecretarioDTO registerSecretario(SecretarioDTO secretarioDTO) {
        if (this.usuarioRepository.findByEmail(secretarioDTO.getEmail()) != null) {
            throw new RuntimeException("Email já cadastrado.");
        }
        String encryptedPassword = passwordEncoder.encode(secretarioDTO.getSenha());
        Secretario newSecretario = new Secretario(
                secretarioDTO.getEmail(),
                encryptedPassword,
                secretarioDTO.getNomeCompleto()
        );
        Secretario savedSecretario = usuarioRepository.save(newSecretario);
        secretarioDTO.setId(savedSecretario.getId());
        secretarioDTO.setSenha(null);
        return secretarioDTO;
    }

    public VeterinarioDTO registerVeterinario(VeterinarioDTO veterinarioDTO) {
        if (this.usuarioRepository.findByEmail(veterinarioDTO.getEmail()) != null) {
            throw new RuntimeException("Email já cadastrado.");
        }
        String encryptedPassword = passwordEncoder.encode(veterinarioDTO.getSenha());
        Veterinario newVeterinario = new Veterinario(
                veterinarioDTO.getEmail(),
                encryptedPassword,
                veterinarioDTO.getNomeCompleto(),
                veterinarioDTO.getCrmv(),
                veterinarioDTO.getEspecialidade()
        );
        Veterinario savedVeterinario = usuarioRepository.save(newVeterinario);
        veterinarioDTO.setId(savedVeterinario.getId());
        veterinarioDTO.setSenha(null);
        return veterinarioDTO;
    }
}
