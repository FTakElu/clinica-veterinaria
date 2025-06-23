package com.clinicaveterinaria.clinicaveterinaria.controller;

import com.clinicaveterinaria.clinicaveterinaria.model.entity.Usuario;
import com.clinicaveterinaria.clinicaveterinaria.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private AuthService authService;

    // Somente ADMINISTRADOR/SECRETARIO pode cadastrar novos usuários (incluindo outros admins, vets, ou comuns)
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('SECRETARIO')")
    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody Usuario usuario) {
        Usuario novoUsuario = authService.cadastrarUsuario(usuario);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    // Somente ADMINISTRADOR/SECRETARIO pode listar todos
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('SECRETARIO')")
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = authService.listarTodos();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    // Somente ADMINISTRADOR/SECRETARIO pode buscar qualquer usuário
    // Um usuário comum só pode buscar a si mesmo (precisa de lógica de segurança mais avançada)
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('SECRETARIO')")
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuarioPorId(@PathVariable Long id) {
        return authService.buscarPorId(id)
                .map(usuario -> new ResponseEntity<>(usuario, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Somente ADMINISTRADOR/SECRETARIO pode atualizar outros usuários
    // Usuários podem atualizar seus próprios dados (requer lógica de segurança de dono do recurso)
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('SECRETARIO')")
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        Usuario usuarioAtualizado = authService.atualizarUsuario(id, usuario);
        return new ResponseEntity<>(usuarioAtualizado, HttpStatus.OK);
    }

    // Somente ADMINISTRADOR/SECRETARIO pode deletar
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('SECRETARIO')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        authService.deletarUsuario(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}