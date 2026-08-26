package br.com.projeto.bikehub.repository;

import br.com.projeto.bikehub.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * ======================================================================
 * REPOSITÓRIO: USUÁRIO (br.com.projeto.bikehub.repository.UsuarioRepository)
 * ======================================================================
 * Interface Spring Data JPA responsável pelas operações de CRUD e busca
 * na tabela 'usuario'.
 *
 * A herança de JpaRepository<Usuario, Long> fornece métodos prontos como:
 * - save(entity), findById(id), findAll(), deleteById(id), count(), etc.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca um usuário ativo pelo seu nome de login (username).
     * O Spring Data JPA deriva automaticamente a consulta SQL:
     * SELECT * FROM usuario WHERE username = ? AND ativo = true
     *
     * @param username Nome de usuário informado no formulário de login
     * @return Optional contendo o usuário caso encontrado
     */
    Optional<Usuario> findByUsernameAndAtivoTrue(String username);

    /**
     * Busca um usuário apenas pelo username (ativo ou inativo).
     *
     * @param username Nome de login
     * @return Optional com o usuário
     */
    Optional<Usuario> findByUsername(String username);

    /**
     * Verifica a existência de um determinado username no banco de dados.
     *
     * @param username Nome de usuário a verificar
     * @return true se já existir cadastrado
     */
    boolean existsByUsername(String username);
}
