package com.clinicaveterinaria.clinicaveterinaria.service;

import com.clinicaveterinaria.clinicaveterinaria.exception.ResourceNotFoundException;
import com.clinicaveterinaria.clinicaveterinaria.model.dto.*;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Cliente;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Secretario;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Usuario;
import com.clinicaveterinaria.clinicaveterinaria.model.entity.Veterinario;
import com.clinicaveterinaria.clinicaveterinaria.model.enums.UsuarioRole;
import com.clinicaveterinaria.clinicaveterinaria.repository.UsuarioRepository;
import com.clinicaveterinaria.clinicaveterinaria.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager; // Remover Autowired para este
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenService tokenService;
    // REMOVIDO PARA EVITAR DEPENDENCIA CIRCULAR:
    // @Autowired
    // private AuthenticationManager authenticationManager;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }

    // O AuthenticationManager deve ser passado como parâmetro, e não injetado como campo na classe.
    // Isso é feito automaticamente pelo Spring quando este método é chamado pelo AuthController.
    public TokenResponseDTO login(AuthDTO authDTO, AuthenticationManager authenticationManager) { // authenticationManager como parâmetro
        var usernamePassword = new UsernamePasswordAuthenticationToken(authDTO.getEmail(), authDTO.getSenha());
        var auth = authenticationManager.authenticate(usernamePassword); // Usar o parâmetro

        Usuario usuario = (Usuario) auth.getPrincipal();
        String token = tokenService.generateToken(usuario);
        return new TokenResponseDTO(token, usuario.getRole().name(), usuario.getId(), usuario.getNome());
    }

    public ClienteDTO registerCliente(ClienteDTO clienteDTO) {
        if (this.usuarioRepository.findByEmail(clienteDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado.");
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
        clienteDTO.setSenha(null);
        return clienteDTO;
    }

    public VeterinarioDTO registerVeterinario(VeterinarioDTO veterinarioDTO) {
        if (this.usuarioRepository.findByEmail(veterinarioDTO.getEmail()).isPresent()) {
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

    public UsuarioDTO registerUserWithRole(UsuarioRegisterDTO usuarioRegisterDTO) {
        if (this.usuarioRepository.findByEmail(usuarioRegisterDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado.");
        }
        String encryptedPassword = passwordEncoder.encode(usuarioRegisterDTO.getSenha());

        Usuario newUser;
        switch (usuarioRegisterDTO.getRole()) {
            case ADMIN:
                newUser = new Usuario(
                        usuarioRegisterDTO.getEmail(),
                        encryptedPassword,
                        UsuarioRole.ADMIN,
                        usuarioRegisterDTO.getNomeCompleto()
                );
                break;
            case SECRETARIO:
                newUser = new Secretario(
                        usuarioRegisterDTO.getEmail(),
                        encryptedPassword,
                        usuarioRegisterDTO.getNomeCompleto()
                );
                break;
            case VETERINARIO:
                newUser = new Veterinario(
                        usuarioRegisterDTO.getEmail(),
                        encryptedPassword,
                        usuarioRegisterDTO.getNomeCompleto(),
                        usuarioRegisterDTO.getCrmv(),
                        usuarioRegisterDTO.getEspecialidade()
                );
                break;
            case CLIENTE:
                newUser = new Cliente(
                        usuarioRegisterDTO.getEmail(),
                        encryptedPassword,
                        usuarioRegisterDTO.getNomeCompleto(),
                        usuarioRegisterDTO.getTelefone(),
                        usuarioRegisterDTO.getCpf()
                );
                break;
            default:
                throw new IllegalArgumentException("Role inválida: " + usuarioRegisterDTO.getRole());
        }

        Usuario savedUser = usuarioRepository.save(newUser);

        UsuarioDTO responseDTO = new UsuarioDTO();
        responseDTO.setId(savedUser.getId());
        responseDTO.setEmail(savedUser.getEmail());
        responseDTO.setNomeCompleto(savedUser.getNome());
        responseDTO.setRole(savedUser.getRole());
        responseDTO.setTelefone(usuarioRegisterDTO.getTelefone());
        responseDTO.setCpf(usuarioRegisterDTO.getCpf());
        responseDTO.setCrmv(usuarioRegisterDTO.getCrmv());
        responseDTO.setEspecialidade(usuarioRegisterDTO.getEspecialidade());

        return responseDTO;
    }
}
