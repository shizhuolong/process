package org.apdplat.platform.service;

import org.apdplat.platform.common.Common;
import org.apdplat.platform.model.Model;
import java.util.List;

public interface Service<T extends Model>  extends Common<T> {
	public List<Exception> delete(Long[] modelIds);
}