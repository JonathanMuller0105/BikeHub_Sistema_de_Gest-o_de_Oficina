package br.com.projeto.bikehub.repository;

import br.com.projeto.bikehub.entity.Aluguel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AluguelRepository extends JpaRepository<Aluguel, Long> {
    List<Aluguel> findAllByOrderByDataCriacaoDescIdDesc();
}
