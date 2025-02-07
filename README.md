# Administración Golden Shark

## Acerca de Administración Golden Shark
Administración Golden Shark es una aplicación diseñada para gestionar usuarios y roles dentro de un entorno basado en **WordPress REST API**. Proporciona una interfaz intuitiva para la creación, visualización, edición y eliminación de usuarios y roles.

## Funcionalidades
La aplicación ofrece diversas funcionalidades de administración:

### 1. Gestión de Roles
- Crear nuevos roles.
- Ver la lista de roles disponibles.
- Eliminar roles existentes.

### 2. Gestión de Usuarios
- Crear nuevos usuarios.
- Ver la lista de usuarios registrados.
- Editar información de los usuarios.
- Eliminar usuarios.

### 3. Gestión de Roles de Usuario
- Ver los roles asignados a un usuario.
- Asignar un nuevo rol a un usuario.
- Eliminar roles de un usuario.

### 4. Sistema de Inicio de Sesión
- Solo los usuarios definidos en `src/data/users.json` pueden iniciar sesión.

## Configuración del API en WordPress
Para que el proyecto funcione correctamente, primero debemos configurar la API en WordPress. Es necesario editar el plugin de Astra dentro del archivo `functions.php` y agregar el siguiente código:

```php

/**
 * Añadir roles de usuario a la API REST
 */

add_action('rest_api_init', function () {
    // Endpoint para obtener todos los usuarios
    register_rest_route('custom-api/v1', '/users', [
        'methods' => 'GET',
        'callback' => function () {
            $users = get_users(['number' => -1]); // Obtiene todos los usuarios sin límite
            $response = [];

            foreach ($users as $user) {
                $response[] = [
                    'id' => $user->ID,
                    'name' => $user->display_name,
                    'email' => $user->user_email,
                    'roles' => $user->roles,
                    'meta' => [
                        'nickname' => get_user_meta($user->ID, 'nickname', true),
                    ],
                ];
            }

            return $response;
        },
        'permission_callback' => function () {
            return current_user_can('list_users'); // Solo usuarios autorizados
        },
    ]);

    // Endpoint para obtener un usuario específico por ID
    register_rest_route('custom-api/v1', '/user/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => function ($data) {
            $user_id = $data['id']; // ID del usuario
            $user = get_userdata($user_id);

            if (!$user) {
                return new WP_Error('user_not_found', 'Usuario no encontrado.', ['status' => 404]);
            }

            return [
                'id' => $user->ID,
                'name' => $user->display_name,
                'email' => $user->user_email,
                'roles' => $user->roles,
                'meta' => [
                    'nickname' => get_user_meta($user->ID, 'nickname', true),
                ],
            ];
        },
        'permission_callback' => function () {
            return current_user_can('list_users'); // Verifica permisos
        },
    ]);

    // Endpoint para agregar un rol a un usuario
    register_rest_route('custom-api/v1', '/user/add-role', [
        'methods' => 'POST',
        'callback' => function ($data) {
            $user_id = $data['id'];
            $new_role = $data['role'];

            $user = get_userdata($user_id);
            if (!$user) {
                return new WP_Error('user_not_found', 'Usuario no encontrado.', ['status' => 404]);
            }

            $user->add_role($new_role);
            return [
                'message' => "Rol '{$new_role}' agregado al usuario '{$user->display_name}'.",
                'user' => [
                    'id' => $user->ID,
                    'name' => $user->display_name,
                    'roles' => $user->roles,
                ],
            ];
        },
        'permission_callback' => function () {
            return current_user_can('edit_users'); // Verifica permisos
        },
        'args' => [
            'id' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    return is_numeric($param);
                },
            ],
            'role' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    return is_string($param);
                },
            ],
        ],
    ]);
	
	// Endpoint para eliminar un rol de un usuario
	register_rest_route('custom-api/v1', '/user/remove-role', [
        'methods' => 'POST',
        'callback' => function ($data) {
            $user_id = $data['id'];
            $role_to_remove = $data['role'];

            // Verificar si el usuario existe
            $user = get_userdata($user_id);
            if (!$user) {
                return new WP_Error('user_not_found', 'Usuario no encontrado.', ['status' => 404]);
            }

            // Verificar si el usuario tiene el rol que se quiere eliminar
            if (!in_array($role_to_remove, $user->roles)) {
                return new WP_Error('role_not_found', 'El usuario no tiene el rol especificado.', ['status' => 400]);
            }

            // Eliminar el rol
            $user->remove_role($role_to_remove);

            return [
                'message' => "Rol '{$role_to_remove}' eliminado del usuario '{$user->display_name}'.",
                'user' => [
                    'id' => $user->ID,
                    'name' => $user->display_name,
                    'roles' => $user->roles, // Roles actuales después de la eliminación
                ],
            ];
        },
        'permission_callback' => function () {
            return current_user_can('edit_users'); // Solo administradores pueden modificar roles
        },
        'args' => [
            'id' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    return is_numeric($param);
                },
            ],
            'role' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    return is_string($param);
                },
            ],
        ],
    ]);
	
	// Endpoint para buscar por el email a un usuario
	register_rest_route('custom-api/v1', '/user/email/(?P<email>[^\/]+)', [
        'methods' => 'GET',
        'callback' => function ($data) {
            $email = sanitize_email(urldecode($data['email'])); // Decodifica y sanitiza el email
            $user = get_user_by('email', $email);

            if (!$user) {
                return new WP_Error('user_not_found', 'Usuario no encontrado.', ['status' => 404]);
            }

            return [
                'id' => $user->ID,
                'name' => $user->display_name,
                'email' => $user->user_email,
                'roles' => $user->roles,
                'meta' => [
                    'nickname' => get_user_meta($user->ID, 'nickname', true),
                ],
            ];
        },
        'permission_callback' => function () {
            return current_user_can('list_users'); // Solo administradores pueden buscar usuarios
        },
    ]);
	
	// Endpoint para buscar por el id a un usuario
	register_rest_route('custom-api/v1', '/user/id/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => function ($data) {
            $id = intval($data['id']); // Sanitiza el ID
            $user = get_user_by('id', $id);

            if (!$user) {
                return new WP_Error('user_not_found', 'Usuario no encontrado.', ['status' => 404]);
            }

            return [
                'id' => $user->ID,
                'name' => $user->display_name,
                'email' => $user->user_email,
                'roles' => $user->roles,
                'meta' => [
                    'nickname' => get_user_meta($user->ID, 'nickname', true),
                ],
            ];
        },
        'permission_callback' => function () {
            return current_user_can('list_users'); // Solo administradores pueden buscar usuarios
        },
    ]);
	
	// Endpoint para buscar por una palabra aleatoria y muestre resultados
	register_rest_route('custom-api/v1', '/user/search/(?P<query>[^\/]+)', [
	    'methods' => 'GET',
	    'callback' => function ($data) {
	        global $wpdb;
	
	        $query = sanitize_text_field($data['query']); // Sanear la búsqueda
	        $users = $wpdb->get_results(
	            $wpdb->prepare(
	                "SELECT ID, user_email, display_name FROM $wpdb->users WHERE user_email LIKE %s OR display_name LIKE %s",
	                '%' . $wpdb->esc_like($query) . '%',
	                '%' . $wpdb->esc_like($query) . '%'
	            )
	        );
	
	        if (empty($users)) {
	            return new WP_Error('no_users_found', 'No se encontraron usuarios.', ['status' => 404]);
	        }
	
	        // Formatear los datos antes de enviarlos
	        return array_map(function ($user) {
	            return [
	                'id' => $user->ID,
	                'name' => $user->display_name,
	                'email' => $user->user_email,
	            ];
	        }, $users);
	    },
	    'permission_callback' => function () {
	        return current_user_can('list_users'); // Solo administradores pueden buscar usuarios
    	},
	]);

	
	
	
});


// ENDPOINT para el api de roles

add_action('rest_api_init', function () {
    // Endpoint para obtener todos los roles
    register_rest_route('custom-api/v1', '/roles', [
        'methods' => 'GET',
        'callback' => function () {
            global $wp_roles;
            $roles = $wp_roles->roles;

            $response = [];
            foreach ($roles as $role_key => $role_details) {
                $response[] = [
                    'key' => $role_key,
                    'name' => $role_details['name'],
                    'capabilities' => $role_details['capabilities'],
                ];
            }

            return $response;
        },
        'permission_callback' => function () {
            return current_user_can('list_users'); // Solo usuarios autorizados
        },
    ]);

    // Endpoint para obtener detalles de un rol específico
    register_rest_route('custom-api/v1', '/role/(?P<key>[^\/]+)', [
        'methods' => 'GET',
        'callback' => function ($data) {
            global $wp_roles;
            $role_key = sanitize_text_field($data['key']);
            $roles = $wp_roles->roles;

            if (!isset($roles[$role_key])) {
                return new WP_Error('role_not_found', 'Rol no encontrado.', ['status' => 404]);
            }

            // Contar cuántos usuarios tienen este rol
            $user_query = new WP_User_Query(['role' => $role_key]);
            $user_count = $user_query->get_total();

            return [
                'key' => $role_key,
                'name' => $roles[$role_key]['name'],
                'capabilities' => $roles[$role_key]['capabilities'],
                'user_count' => $user_count,
            ];
        },
        'permission_callback' => function () {
            return current_user_can('list_users'); // Solo usuarios autorizados
        },
    ]);

    // Endpoint para editar el nombre de un rol
    register_rest_route('custom-api/v1', '/role/edit', [
	    'methods' => 'POST',
	    'callback' => function ($data) {
	        $role_key = sanitize_text_field($data['key']);
	        $new_name = sanitize_text_field($data['name']);
	
	        global $wp_roles;
	
	        if (!isset($wp_roles->roles[$role_key])) {
	            return new WP_Error('role_not_found', 'Rol no encontrado.', ['status' => 404]);
	        }
	
	        // Actualizar el nombre del rol
	        $wp_roles->roles[$role_key]['name'] = $new_name;
	
	        // Actualizar roleLabels.js
	        $roles = $wp_roles->roles;
	        $content = "const defaultRoleLabels = {\n";
	        foreach ($roles as $role_key => $role_details) {
	            $content .= "  \"$role_key\": \"" . addslashes($role_details['name']) . "\",\n";
	        }
	        $content .= "};\n\nexport default defaultRoleLabels;";
	
	        // Ruta del archivo roleLabels.js
	        $file_path = get_template_directory() . '/src/utils/roleLabels.js'; // Ajusta la ruta según tu estructura
	        file_put_contents($file_path, $content);
	
	        return [
	            'message' => "El nombre del rol se actualizó correctamente.",
	            'role' => [
	                'key' => $role_key,
	                'name' => $new_name,
	            ],
	        ];
	    },
	    'permission_callback' => function () {
	        return current_user_can('edit_users'); // Solo usuarios autorizados
	    },
	    'args' => [
	        'key' => [
	            'required' => true,
	            'validate_callback' => function ($param) {
	                return is_string($param);
	            },
	        ],
	        'name' => [
	            'required' => true,
	            'validate_callback' => function ($param) {
	                return is_string($param);
	            },
	        ],
	    ],
	]);


    // Endpoint para eliminar un rol
    register_rest_route('custom-api/v1', '/role/delete', [
    	'methods' => 'POST',
    	'callback' => function ($data) {
	        $role_key = sanitize_text_field($data['key']);
	        global $wp_roles;
	
	        // Verificar si es un rol protegido
	        $protected_roles = ['administrator', 'author', 'contributor', 'editor', 'subscriber'];
	        if (in_array($role_key, $protected_roles)) {
	            return new WP_Error('role_protected', 'Este rol está protegido y no se puede eliminar.', ['status' => 403]);
	        }
	
	        // Verificar si el rol existe
	        if (!isset($wp_roles->roles[$role_key])) {
	            return new WP_Error('role_not_found', 'Rol no encontrado.', ['status' => 404]);
	        }
	
	        // Eliminar el rol
	        remove_role($role_key);
	
	        // Actualizar roleLabels.js
	        $roles = $wp_roles->roles;
	        $content = "const defaultRoleLabels = {\n";
	        foreach ($roles as $role_key => $role_details) {
	            $content .= "  \"$role_key\": \"" . addslashes($role_details['name']) . "\",\n";
	        }
	        $content .= "};\n\nexport default defaultRoleLabels;";
	
	        // Ruta del archivo roleLabels.js
	        $file_path = get_template_directory() . '/src/utils/roleLabels.js'; // Ajusta la ruta según tu estructura
	        file_put_contents($file_path, $content);
	
	        return [
	            'message' => "El rol '{$role_key}' fue eliminado correctamente.",
	        ];
	    },
	    'permission_callback' => function () {
	        return current_user_can('delete_users'); // Solo usuarios autorizados
	    },
	    'args' => [
	        'key' => [
	            'required' => true,
	            'validate_callback' => function ($param) {
	                return is_string($param);
	            },
	        ],
	    ],
	]);

	
	// Endpoint para crear un nuevo rol
	register_rest_route('custom-api/v1', '/roles/create', [
	    'methods' => 'POST',
	    'callback' => function ($data) {
	        $key = sanitize_text_field($data['key']);
	        $friendlyName = sanitize_text_field($data['friendlyName']);
	
	        if (empty($key) || empty($friendlyName)) {
	            return new WP_Error('missing_fields', 'Faltan campos obligatorios.', ['status' => 400]);
	        }
	
	        // Crea el rol en WordPress
	        $result = add_role($key, $friendlyName);
	
	        if (!$result) {
	            return new WP_Error('role_creation_failed', 'No se pudo crear el rol. Es posible que ya exista.', ['status' => 400]);
	        }
	
	        // Actualizar roleLabels.js
	        global $wp_roles;
	        $roles = $wp_roles->roles;
	        $content = "const defaultRoleLabels = {\n";
	        foreach ($roles as $role_key => $role_details) {
	            $content .= "  \"$role_key\": \"" . addslashes($role_details['name']) . "\",\n";
	        }
	        $content .= "};\n\nexport default defaultRoleLabels;";
	
	        // Ruta del archivo roleLabels.js
	        $file_path = get_template_directory() . '/src/utils/roleLabels.js'; // Ajusta la ruta según tu estructura
	        file_put_contents($file_path, $content);
	
	        return [
	            'message' => "Rol '{$friendlyName}' creado exitosamente.",
	            'role' => $key,
	        ];
	    },
	    'permission_callback' => function () {
	        return current_user_can('create_roles'); // Verifica permisos
	    },
	]);


});

//Endpoint para Generar roleLabels.js
add_action('rest_api_init', function () {
    register_rest_route('custom-api/v1', '/export-role-labels', [
        'methods' => 'GET',
        'callback' => function () {
            global $wp_roles;
            $roles = $wp_roles->roles;

            $content = "const defaultRoleLabels = {\n";
            foreach ($roles as $key => $details) {
                $name = addslashes($details['name']);
                $content .= "  \"$key\": \"$name\",\n";
            }
            $content .= "};\n\nexport default defaultRoleLabels;";

            // Escribe en un archivo físico
            $file_path = wp_upload_dir()['basedir'] . '/roleLabels.js';
            file_put_contents($file_path, $content);

            return [
                'message' => "Archivo roleLabels.js generado correctamente.",
                'file_path' => $file_path,
            ];
        },
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ]);
});

//Enpoint para gestionar a los usuarios
add_action('rest_api_init', function () {
    // Endpoint para obtener información básica de los usuarios con nombre y apellido separados
    register_rest_route('custom-api/v1', '/users_info', [
        'methods' => 'GET',
        'callback' => function () {
            $users = get_users(['number' => -1]); // Obtiene todos los usuarios
            $response = [];

            foreach ($users as $user) {
                // Obtiene el nombre y apellido del meta
                $first_name = get_user_meta($user->ID, 'first_name', true);
                $last_name = get_user_meta($user->ID, 'last_name', true);

                $response[] = [
                    'id' => $user->ID,
                    'first_name' => $first_name ?: '', // Si no hay nombre, devuelve cadena vacía
                    'last_name' => $last_name ?: '',   // Si no hay apellido, devuelve cadena vacía
                    'username' => $user->user_login,
					'email' => $user->user_email,
                    'roles' => $user->roles,
                ];
            }

            return $response;
        },
        'permission_callback' => function () {
            return current_user_can('list_users'); // Verifica permisos
        },
    ]);
	
	//Endpoint para ver un usuario especifico
	register_rest_route('custom-api/v1', '/users_info/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => function ($data) {
            $user_id = intval($data['id']); // Sanitizar y obtener el ID del usuario
            $user = get_userdata($user_id);

            // Verificar si el usuario existe
            if (!$user) {
                return new WP_Error('user_not_found', 'Usuario no encontrado.', ['status' => 404]);
            }

            // Obtener los nombres separados
            $first_name = get_user_meta($user->ID, 'first_name', true);
            $last_name = get_user_meta($user->ID, 'last_name', true);

            // Devolver la información del usuario
            return [
                'id' => $user->ID,
                'first_name' => $first_name ? $first_name : '',
                'last_name' => $last_name ? $last_name : '',
                'username' => $user->user_login,
                'email' => $user->user_email,
                'roles' => $user->roles,
            ];
        },
        'permission_callback' => function () {
            return current_user_can('list_users'); // Solo administradores o usuarios autorizados
        },
    ]);
	
	
	//Endpoint para crear un nuevo usuario
	register_rest_route('custom-api/v1', '/users_info/create', [
        'methods' => 'POST',
        'callback' => function ($data) {
            $username = sanitize_text_field($data['username']);
            $email = sanitize_email($data['email']);
            $password = sanitize_text_field($data['password']);
            $first_name = sanitize_text_field($data['first_name']);
            $last_name = sanitize_text_field($data['last_name']);

            if (empty($username) || empty($email) || empty($password)) {
                return new WP_Error('missing_fields', 'El nombre de usuario, el correo electrónico y la contraseña son obligatorios.', ['status' => 400]);
            }

            $user_id = wp_insert_user([
                'user_login' => $username,
                'user_email' => $email,
                'user_pass' => $password,
                'first_name' => $first_name,
                'last_name' => $last_name,
                'role' => 'subscriber', // Asigna el rol predeterminado de suscriptor
            ]);

            if (is_wp_error($user_id)) {
                return new WP_Error('user_creation_failed', $user_id->get_error_message(), ['status' => 400]);
            }

            return [
                'message' => 'Usuario creado correctamente.',
                'user_id' => $user_id,
            ];
        },
        'permission_callback' => function () {
            return current_user_can('create_users'); // Verifica permisos
        },
        'args' => [
            'username' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    return is_string($param);
                },
            ],
            'email' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    return filter_var($param, FILTER_VALIDATE_EMAIL) !== false;
                },
            ],
            'password' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    return is_string($param);
                },
            ],
        ],
    ]);
	
	//Endpoint para editar un usuario
	 register_rest_route('custom-api/v1', '/users_info/edit/(?P<id>\d+)', [
        'methods' => 'POST',
        'callback' => function ($data) {
            $user_id = intval($data['id']);
            $user = get_userdata($user_id);

            if (!$user) {
                return new WP_Error('user_not_found', 'Usuario no encontrado.', ['status' => 404]);
            }

            $updated_data = [
                'ID' => $user_id,
                'first_name' => sanitize_text_field($data['first_name']),
                'last_name' => sanitize_text_field($data['last_name']),
                'user_email' => sanitize_email($data['email']),
                'nickname' => sanitize_text_field($data['nickname']),
            ];

            $result = wp_update_user($updated_data);

            if (is_wp_error($result)) {
                return new WP_Error('update_failed', $result->get_error_message(), ['status' => 400]);
            }

            return [
                'message' => 'Usuario actualizado correctamente.',
                'user_id' => $user_id,
            ];
        },
        'permission_callback' => function () {
            return current_user_can('edit_users'); // Verifica permisos
        },
        'args' => [
            'id' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    return is_numeric($param);
                },
            ],
            'email' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    return filter_var($param, FILTER_VALIDATE_EMAIL) !== false;
                },
            ],
            'first_name' => [
                'required' => false,
            ],
            'last_name' => [
                'required' => false,
            ],
            'nickname' => [
                'required' => false,
            ],
        ],
    ]);
	
	//Endpoint para eliminar un usuario
	register_rest_route('custom-api/v1', '/users_info/delete/(?P<id>\d+)', [
        'methods' => 'DELETE',
        'callback' => function ($data) {
            $user_id = intval($data['id']);
            $user = get_userdata($user_id);

            if (!$user) {
                return new WP_Error('user_not_found', 'Usuario no encontrado.', ['status' => 404]);
            }

            require_once(ABSPATH . 'wp-admin/includes/user.php'); // Incluye las funciones para eliminar usuarios
            $result = wp_delete_user($user_id);

            if (!$result) {
                return new WP_Error('deletion_failed', 'No se pudo eliminar el usuario.', ['status' => 400]);
            }

            return [
                'message' => 'Usuario eliminado correctamente.',
                'user_id' => $user_id,
            ];
        },
        'permission_callback' => function () {
            return current_user_can('delete_users'); // Verifica permisos
        },
        'args' => [
            'id' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    return is_numeric($param);
                },
            ],
        ],
    ]);
	
	//Endpoint para buscar un usuario
	register_rest_route('custom-api/v1', '/user/search/(?P<query>[^\/]+)', [
	    'methods' => 'GET',
	    'callback' => function ($data) {
	        global $wpdb;
	
	        $query = sanitize_text_field($data['query']); // Sanear la búsqueda
	        $users = $wpdb->get_results(
	            $wpdb->prepare(
	                "SELECT ID, user_email, display_name FROM $wpdb->users WHERE user_email LIKE %s OR display_name LIKE %s",
	                '%' . $wpdb->esc_like($query) . '%',
	                '%' . $wpdb->esc_like($query) . '%'
	            )
	        );
	
	        if (empty($users)) {
	            return new WP_Error('no_users_found', 'No se encontraron usuarios.', ['status' => 404]);
	        }
	
	        return array_map(function ($user) {
	            return [
	                'id' => $user->ID,
	                'name' => $user->display_name,
	                'email' => $user->user_email,
	            ];
	        }, $users);
	    },
	    'permission_callback' => function () {
	        return current_user_can('list_users');
	    },
	]);
	
	
});
```

Para más endpoints y funcionalidades, revisa el archivo `functions.php` dentro del plugin de Astra.

## Tecnologías utilizadas
Este proyecto ha sido desarrollado utilizando:

- **React + Vite** con **JavaScript** para la interfaz de usuario.
- **WordPress REST API** para la gestión de usuarios y roles.

## Autor
Este proyecto ha sido desarrollado por **Bryan Gallegos**.

## Licencia
© 2024 Bryan Gallegos. Todos los derechos reservados.

